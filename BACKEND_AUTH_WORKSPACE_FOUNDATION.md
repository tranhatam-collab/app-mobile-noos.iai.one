# CUSTOMER INTELLIGENCE OS
## BACKEND AUTH + WORKSPACE FOUNDATION
Phiên bản: v1
Mục tiêu: Cung cấp nội dung mẫu và nguyên tắc dựng lớp auth, endpoint `GET /v1/auth/me`, `auth.middleware.ts`, và `workspace.middleware.ts` theo đúng nền multi-tenant, permission-aware, audit-ready.

==================================================
I. MỤC TIÊU CỦA PHASE NÀY
==================================================

Ở phase này, backend phải đạt được 6 điều:

1. Có login cơ bản bằng email/password
2. Có JWT verify middleware
3. Có endpoint `GET /v1/auth/me`
4. Có workspace context middleware
5. Có thể xác định user đang thuộc workspace nào
6. Có thể chặn user truy cập workspace không thuộc về họ

Đây là phase nền.
Chưa cần MFA, SSO, refresh token rotation quá sâu nếu chưa cần.
Nhưng kiến trúc phải đủ sạch để nâng cấp sau.

==================================================
II. CẤU TRÚC FILE CHO PHASE NÀY
==================================================

```text
src/
├── modules/
│   └── auth/
│       ├── auth.types.ts
│       ├── auth.validators.ts
│       ├── auth.repository.ts
│       ├── auth.service.ts
│       ├── auth.serializer.ts
│       ├── auth.errors.ts
│       └── index.ts
├── domains/
│   └── workspace/
│       ├── workspace.types.ts
│       ├── workspace.repository.ts
│       ├── workspace.service.ts
│       ├── workspace.policy.ts
│       └── index.ts
├── interfaces/
│   └── http/
│       ├── routes/
│       │   └── auth.routes.ts
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   └── workspace.middleware.ts
│       ├── controllers/
│       │   └── auth.controller.ts
│       └── serializers/
│           └── auth-response.serializer.ts
└── core/
    └── tenancy/
        ├── request-context.types.ts
        └── workspace-context.ts

==================================================
III. YÊU CẦU DB TỐI THIỂU

DB phải có các bảng:
	•	users
	•	workspaces
	•	workspace_members

Tối thiểu users cần:
	•	id
	•	email
	•	full_name
	•	status
	•	created_at
	•	updated_at

Để login thực tế, cần thêm:
	•	password_hash

Nếu chưa thêm ở migration đầu, cần migration tiếp theo.

==================================================
IV. MIGRATION BỔ SUNG CHO AUTH

FILE: migrations/0002_auth_password.sql

ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

LƯU Ý:
	•	Không lưu password plain text
	•	Chỉ lưu hash
	•	Giai đoạn đầu có thể dùng bcrypt hoặc argon2
	•	Khuyên dùng argon2 nếu triển khai production thật

==================================================
V. FILE: src/modules/auth/auth.types.ts

export type AuthenticatedUser = {
  id: string;
  email: string;
  full_name: string | null;
  status: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthMeResponse = {
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    role: string;
    status: string;
    plan: string;
  } | null;
  permissions: string[];
};

==================================================
VI. FILE: src/modules/auth/auth.validators.ts

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6)
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;

==================================================
VII. FILE: src/modules/auth/auth.errors.ts

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class InactiveUserError extends Error {
  constructor() {
    super('User account is not active');
    this.name = 'InactiveUserError';
  }
}

export class WorkspaceAccessDeniedError extends Error {
  constructor() {
    super('You do not have access to this workspace');
    this.name = 'WorkspaceAccessDeniedError';
  }
}

==================================================
VIII. FILE: src/modules/auth/auth.repository.ts

import { db } from '../../bootstrap/db.js';

export async function findUserByEmail(email: string) {
  const result = await db.query(
    `
    SELECT id, email, full_name, status, password_hash
    FROM users
    WHERE email = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function findUserById(userId: string) {
  const result = await db.query(
    `
    SELECT id, email, full_name, status
    FROM users
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] ?? null;
}

export async function findUserWorkspaceMemberships(userId: string) {
  const result = await db.query(
    `
    SELECT
      wm.id,
      wm.workspace_id,
      wm.role,
      wm.status,
      w.name AS workspace_name,
      w.slug AS workspace_slug,
      w.plan AS workspace_plan,
      w.status AS workspace_status
    FROM workspace_members wm
    INNER JOIN workspaces w ON w.id = wm.workspace_id
    WHERE wm.user_id = $1
      AND w.deleted_at IS NULL
    ORDER BY wm.created_at ASC
    `,
    [userId]
  );

  return result.rows;
}

==================================================
IX. FILE: src/domains/workspace/workspace.repository.ts

import { db } from '../../bootstrap/db.js';

export async function findWorkspaceMembershipByUserAndWorkspace(
  userId: string,
  workspaceId: string
) {
  const result = await db.query(
    `
    SELECT
      wm.id,
      wm.workspace_id,
      wm.role,
      wm.status AS membership_status,
      w.name,
      w.slug,
      w.plan,
      w.status AS workspace_status
    FROM workspace_members wm
    INNER JOIN workspaces w ON w.id = wm.workspace_id
    WHERE wm.user_id = $1
      AND wm.workspace_id = $2
      AND w.deleted_at IS NULL
    LIMIT 1
    `,
    [userId, workspaceId]
  );

  return result.rows[0] ?? null;
}

export async function findFirstActiveWorkspaceMembership(userId: string) {
  const result = await db.query(
    `
    SELECT
      wm.id,
      wm.workspace_id,
      wm.role,
      wm.status AS membership_status,
      w.name,
      w.slug,
      w.plan,
      w.status AS workspace_status
    FROM workspace_members wm
    INNER JOIN workspaces w ON w.id = wm.workspace_id
    WHERE wm.user_id = $1
      AND wm.status = 'active'
      AND w.status = 'active'
      AND w.deleted_at IS NULL
    ORDER BY wm.created_at ASC
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] ?? null;
}

==================================================
X. FILE: src/domains/workspace/workspace.service.ts

import {
  findFirstActiveWorkspaceMembership,
  findWorkspaceMembershipByUserAndWorkspace
} from './workspace.repository.js';

export async function resolveWorkspaceForUser(params: {
  userId: string;
  requestedWorkspaceId?: string | null;
}) {
  const { userId, requestedWorkspaceId } = params;

  if (requestedWorkspaceId) {
    return findWorkspaceMembershipByUserAndWorkspace(userId, requestedWorkspaceId);
  }

  return findFirstActiveWorkspaceMembership(userId);
}

==================================================
XI. FILE: src/modules/auth/auth.service.ts

import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '../../bootstrap/env.js';
import {
  findUserByEmail,
  findUserById,
  findUserWorkspaceMemberships
} from './auth.repository.js';
import {
  InactiveUserError,
  InvalidCredentialsError
} from './auth.errors.js';

function hashPasswordForCurrentStage(password: string) {
  return createHash('sha256')
    .update(`${password}:${env.JWT_SECRET}`)
    .digest('hex');
}

export async function loginWithEmailPassword(input: {
  email: string;
  password: string;
}) {
  const user = await findUserByEmail(input.email);

  if (!user || !user.password_hash) {
    throw new InvalidCredentialsError();
  }

  const providedHash = hashPasswordForCurrentStage(input.password);
  const storedBuffer = Buffer.from(user.password_hash);
  const providedBuffer = Buffer.from(providedHash);

  const isValid =
    storedBuffer.length === providedBuffer.length &&
    timingSafeEqual(storedBuffer, providedBuffer);

  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  if (user.status !== 'active') {
    throw new InactiveUserError();
  }

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    status: user.status
  };
}

export async function getAuthMePayload(userId: string, workspaceId?: string | null) {
  const user = await findUserById(userId);

  if (!user || user.status !== 'active') {
    throw new InactiveUserError();
  }

  const memberships = await findUserWorkspaceMemberships(userId);

  let selectedMembership =
    memberships.find((item) => item.workspace_id === workspaceId) ??
    memberships.find((item) => item.status === 'active' && item.workspace_status === 'active') ??
    null;

  const permissions = derivePermissionsFromRole(selectedMembership?.role ?? null);

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name
    },
    workspace: selectedMembership
      ? {
          id: selectedMembership.workspace_id,
          name: selectedMembership.workspace_name,
          slug: selectedMembership.workspace_slug,
          role: selectedMembership.role,
          status: selectedMembership.workspace_status,
          plan: selectedMembership.workspace_plan
        }
      : null,
    permissions
  };
}

function derivePermissionsFromRole(role: string | null): string[] {
  if (!role) return [];

  const roleMap: Record<string, string[]> = {
    owner: ['*'],
    admin: [
      'workspace.view',
      'organization.view',
      'organization.edit',
      'contact.view',
      'contact.edit',
      'lead.view',
      'lead.edit',
      'task.view',
      'task.edit',
      'billing.view'
    ],
    compliance_admin: [
      'workspace.view',
      'organization.view',
      'contact.view',
      'lead.view',
      'compliance.view',
      'compliance.edit',
      'audit.view'
    ],
    sales_manager: [
      'workspace.view',
      'organization.view',
      'organization.edit',
      'contact.view',
      'contact.edit',
      'lead.view',
      'lead.edit',
      'task.view',
      'task.edit'
    ],
    sales_rep: [
      'workspace.view',
      'organization.view',
      'contact.view',
      'lead.view',
      'lead.edit',
      'task.view',
      'task.edit'
    ],
    analyst: [
      'workspace.view',
      'organization.view',
      'contact.view',
      'lead.view'
    ],
    reviewer: [
      'workspace.view',
      'review_queue.view',
      'review_queue.edit'
    ],
    finance: [
      'workspace.view',
      'billing.view'
    ],
    support: [
      'workspace.view',
      'organization.view',
      'contact.view',
      'lead.view'
    ],
    readonly: [
      'workspace.view',
      'organization.view',
      'contact.view',
      'lead.view',
      'task.view'
    ]
  };

  return roleMap[role] ?? [];
}

==================================================
XII. FILE: src/modules/auth/auth.serializer.ts

export function serializeAuthMeResponse(payload: {
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
    role: string;
    status: string;
    plan: string;
  } | null;
  permissions: string[];
}) {
  return {
    user: payload.user,
    workspace: payload.workspace,
    permissions: payload.permissions
  };
}

==================================================
XIII. FILE: src/core/tenancy/request-context.types.ts

export type RequestAuthUser = {
  id: string;
  email: string;
};

export type RequestWorkspaceContext = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  membership_status: string;
  workspace_status: string;
};

export type AppRequestContext = {
  authUser?: RequestAuthUser;
  workspace?: RequestWorkspaceContext;
};

==================================================
XIV. FILE: src/core/tenancy/workspace-context.ts

import type { FastifyRequest } from 'fastify';
import type { AppRequestContext } from './request-context.types.js';

export function getRequestContext(request: FastifyRequest): AppRequestContext {
  const ctx = (request as FastifyRequest & { appContext?: AppRequestContext }).appContext;

  if (!ctx) {
    const newCtx: AppRequestContext = {};
    (request as FastifyRequest & { appContext: AppRequestContext }).appContext = newCtx;
    return newCtx;
  }

  return ctx;
}

==================================================
XV. FILE: src/interfaces/http/middlewares/auth.middleware.ts

import type { FastifyReply, FastifyRequest } from 'fastify';
import { getRequestContext } from '../../../core/tenancy/workspace-context.js';

type JwtPayload = {
  sub: string;
  email: string;
};

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify<JwtPayload>();

    const payload = request.user as JwtPayload;
    const ctx = getRequestContext(request);

    ctx.authUser = {
      id: payload.sub,
      email: payload.email
    };
  } catch (_error) {
    reply.status(401).send({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      },
      meta: {
        request_id: request.id
      }
    });
  }
}

==================================================
XVI. FILE: src/interfaces/http/middlewares/workspace.middleware.ts

import type { FastifyReply, FastifyRequest } from 'fastify';
import { getRequestContext } from '../../../core/tenancy/workspace-context.js';
import { resolveWorkspaceForUser } from '../../../domains/workspace/workspace.service.js';

export async function workspaceMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const ctx = getRequestContext(request);

  if (!ctx.authUser) {
    reply.status(401).send({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required before workspace resolution'
      },
      meta: {
        request_id: request.id
      }
    });
    return;
  }

  const requestedWorkspaceId =
    typeof request.headers['x-workspace-id'] === 'string'
      ? request.headers['x-workspace-id']
      : null;

  const membership = await resolveWorkspaceForUser({
    userId: ctx.authUser.id,
    requestedWorkspaceId
  });

  if (!membership) {
    reply.status(403).send({
      ok: false,
      error: {
        code: 'WORKSPACE_ACCESS_DENIED',
        message: 'You do not have access to this workspace'
      },
      meta: {
        request_id: request.id
      }
    });
    return;
  }

  if (membership.membership_status !== 'active') {
    reply.status(403).send({
      ok: false,
      error: {
        code: 'MEMBERSHIP_INACTIVE',
        message: 'Workspace membership is not active'
      },
      meta: {
        request_id: request.id
      }
    });
    return;
  }

  if (membership.workspace_status !== 'active') {
    reply.status(403).send({
      ok: false,
      error: {
        code: 'WORKSPACE_INACTIVE',
        message: 'Workspace is not active'
      },
      meta: {
        request_id: request.id
      }
    });
    return;
  }

  ctx.workspace = {
    id: membership.workspace_id,
    name: membership.name,
    slug: membership.slug,
    plan: membership.plan,
    role: membership.role,
    membership_status: membership.membership_status,
    workspace_status: membership.workspace_status
  };
}

==================================================
XVII. FILE: src/interfaces/http/controllers/auth.controller.ts

import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema } from '../../../modules/auth/auth.validators.js';
import { loginWithEmailPassword, getAuthMePayload } from '../../../modules/auth/auth.service.js';
import { serializeAuthMeResponse } from '../../../modules/auth/auth.serializer.js';
import { getRequestContext } from '../../../core/tenancy/workspace-context.js';
import { InvalidCredentialsError, InactiveUserError } from '../../../modules/auth/auth.errors.js';

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const parsed = loginSchema.parse(request.body);
    const user = await loginWithEmailPassword(parsed);

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email
    });

    return reply.send({
      ok: true,
      data: {
        token,
        user
      },
      meta: {
        request_id: request.id
      }
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        ok: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: error.message
        },
        meta: {
          request_id: request.id
        }
      });
    }

    if (error instanceof InactiveUserError) {
      return reply.status(403).send({
        ok: false,
        error: {
          code: 'USER_INACTIVE',
          message: error.message
        },
        meta: {
          request_id: request.id
        }
      });
    }

    throw error;
  }
}

export async function meController(request: FastifyRequest, reply: FastifyReply) {
  const ctx = getRequestContext(request);

  if (!ctx.authUser) {
    return reply.status(401).send({
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      },
      meta: {
        request_id: request.id
      }
    });
  }

  const payload = await getAuthMePayload(
    ctx.authUser.id,
    ctx.workspace?.id ?? null
  );

  return reply.send({
    ok: true,
    data: serializeAuthMeResponse(payload),
    meta: {
      request_id: request.id
    }
  });
}

==================================================
XVIII. FILE: src/interfaces/http/routes/auth.routes.ts

import type { FastifyInstance } from 'fastify';
import { loginController, meController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { workspaceMiddleware } from '../middlewares/workspace.middleware.js';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/v1/auth/login', loginController);

  app.get(
    '/v1/auth/me',
    {
      preHandler: [authMiddleware, workspaceMiddleware]
    },
    meController
  );
}

==================================================
XIX. CẬP NHẬT FILE: src/app/create-app.ts

Trong create-app.ts, sau health routes, thêm:

import { registerAuthRoutes } from '../interfaces/http/routes/auth.routes.js';

Và thêm:

await registerAuthRoutes(app);

==================================================
XX. CẬP NHẬT TYPE CHO FASTIFY REQUEST

FILE: src/types/fastify.d.ts

import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    appContext?: {
      authUser?: {
        id: string;
        email: string;
      };
      workspace?: {
        id: string;
        name: string;
        slug: string;
        plan: string;
        role: string;
        membership_status: string;
        workspace_status: string;
      };
    };
  }
}

LƯU Ý:
tsconfig.json phải include src/**/*.ts, và file .d.ts này nằm trong src/types/.

==================================================
XXI. FILE SEED USER DEV TẠM THỜI

FILE: src/scripts/seed-dev-user.ts

import { createHash } from 'node:crypto';
import { db } from '../bootstrap/db.js';
import { env } from '../bootstrap/env.js';

function hashPassword(password: string) {
  return createHash('sha256')
    .update(`${password}:${env.JWT_SECRET}`)
    .digest('hex');
}

async function run() {
  const userResult = await db.query(
    `
    INSERT INTO users (email, full_name, status, password_hash)
    VALUES ($1, $2, 'active', $3)
    ON CONFLICT (email)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      password_hash = EXCLUDED.password_hash,
      updated_at = NOW()
    RETURNING id
    `,
    ['admin@example.com', 'Admin User', hashPassword('12345678')]
  );

  const userId = userResult.rows[0].id;

  const workspaceResult = await db.query(
    `
    INSERT INTO workspaces (name, slug, plan, status)
    VALUES ($1, $2, 'pro', 'active')
    ON CONFLICT (slug)
    DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING id
    `,
    ['Default Workspace', 'default-workspace']
  );

  const workspaceId = workspaceResult.rows[0].id;

  await db.query(
    `
    INSERT INTO workspace_members (workspace_id, user_id, role, status, joined_at)
    VALUES ($1, $2, 'owner', 'active', NOW())
    ON CONFLICT (workspace_id, user_id)
    DO UPDATE SET
      role = EXCLUDED.role,
      status = EXCLUDED.status,
      updated_at = NOW()
    `,
    [workspaceId, userId]
  );

  console.log('✅ Seeded dev user');
  console.log('Email: admin@example.com');
  console.log('Password: 12345678');
  console.log('Workspace ID:', workspaceId);

  await db.end();
}

run().catch(async (error) => {
  console.error(error);
  await db.end();
  process.exit(1);
});

Thêm vào package.json:

{
  "scripts": {
    "seed:dev-user": "tsx src/scripts/seed-dev-user.ts"
  }
}

==================================================
XXII. CÁCH CHẠY PHASE NÀY

Bước 1

Chạy migration auth:

pnpm db:migrate

Bước 2

Seed user dev:

pnpm seed:dev-user

Bước 3

Chạy server:

pnpm dev

Bước 4

Login:

curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"12345678"}'

Lấy token trả về.

Bước 5

Gọi me:

curl http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

Hoặc nếu muốn chỉ rõ workspace:

curl http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "X-Workspace-Id: YOUR_WORKSPACE_ID_HERE"

==================================================
XXIII. RESPONSE MẪU CHO /v1/auth/me

{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "full_name": "Admin User"
    },
    "workspace": {
      "id": "uuid",
      "name": "Default Workspace",
      "slug": "default-workspace",
      "role": "owner",
      "status": "active",
      "plan": "pro"
    },
    "permissions": ["*"]
  },
  "meta": {
    "request_id": "req-id"
  }
}

==================================================
XXIV. NHỮNG LƯU Ý RẤT RÕ TRONG CODE
	1.	Không trust X-Workspace-Id từ client nếu user không có membership.
	2.	Không nhét role vào JWT rồi tin hoàn toàn về sau.
	3.	JWT chỉ nên chứa tối thiểu:

	•	sub
	•	email
	•	maybe session version sau này

	4.	Quyền thật phải lấy từ DB hoặc policy layer.
	5.	Không cho route nghiệp vụ chỉ dùng authMiddleware mà quên workspaceMiddleware.
	6.	Không để user suspended vẫn login dùng API bình thường.
	7.	Không dùng password hash kiểu demo này lâu dài ở production.
	8.	Production nên chuyển sang argon2 hoặc bcrypt chuẩn.
	9.	Không log password hoặc token.
	10.	GET /v1/auth/me phải là endpoint nền để frontend boot app.

==================================================
XXV. CHECKLIST PASS CHO PHASE NÀY
	•	login thành công với user seed
	•	login sai password trả 401
	•	/v1/auth/me không token trả 401
	•	/v1/auth/me có token trả user + workspace
	•	user không thuộc workspace bị chặn đúng
	•	membership suspended bị chặn đúng
	•	workspace inactive bị chặn đúng
	•	không có request nào đọc được tenant khác bằng UUID đoán mò

==================================================
XXVI. BƯỚC SAU PHASE NÀY

Sau khi phase này ổn, mới nên sang:
	•	permission engine thật
	•	organization CRUD
	•	contact CRUD
	•	lead CRUD

Không nên sang search/global/source-governance quá sớm khi multi-tenant auth chưa vững.

==================================================
XXVII. KẾT LUẬN

Đây là nền xác thực và ngữ cảnh workspace tối thiểu nhưng đúng hướng:
	•	auth rõ
	•	workspace rõ
	•	tenant isolation bắt đầu đúng
	•	frontend có /v1/auth/me để boot
	•	backend có chỗ để gắn permission engine ở bước sau

END FILE
