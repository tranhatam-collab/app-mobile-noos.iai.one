# NOOS_MASTER_IMPLEMENTATION_GUIDE.md

# NOOS Civilization OS — Master Implementation Guide
Phiên bản hợp nhất dành cho DEV và AI  
Mục tiêu: một tài liệu duy nhất đủ để hiểu tổng thể, chia giai đoạn triển khai, dựng codebase, mở rộng hạ tầng, hoàn thiện web, app, flow, map, twin, trust, device và toàn bộ lớp ngôn ngữ của NOOS.

---

## 1. Tuyên bố mở đầu

NOOS không phải chỉ là một ứng dụng, một website hay một AI assistant.  
NOOS là lớp điều phối của ý nghĩa, ý định, nhận thức, hành động, niềm tin, bằng chứng, twin và hạ tầng sống.

Toàn bộ hệ được xây theo 3 lớp lớn:

NOOS = Core Operating Fabric  
FLOW = Execution Fabric  
SUPER APP = Experience Layer

Diễn giải đơn giản cho DEV:

NOOS là bộ não và hệ quy tắc.  
FLOW là cơ chế chạy.  
SUPER APP là nơi con người nhìn thấy và điều khiển.

Mọi module, API, database, giao diện, thiết bị, agent và automation đều phải bám theo cách chia này.

---

## 2. Kết quả cuối cùng cần đạt

Khi hoàn thiện theo nhiều giai đoạn, hệ thống phải cho phép:

Người dùng nhập một yêu cầu bằng ngôn ngữ tự nhiên, giọng nói, camera, dữ liệu cảm biến, và về sau có thể thêm neural-safe input.  
NOOS phải hiểu yêu cầu ở tầng ý nghĩa, không chỉ ở tầng từ ngữ.  
NOOS phải biến yêu cầu đó thành intent có cấu trúc.  
FLOW phải kiểm tra policy, consent, trust, risk rồi mới lập workflow.  
Workflow phải chạy được trên web, app, edge, hoặc thiết bị ngoài thực địa.  
Mọi hành động phải có evidence, có thể audit, có thể rollback, có thể giải thích.

Ví dụ mục tiêu đầu tiên:

Người dùng nói: “Tôi muốn sống tốt hơn.”  
Hệ thống phải có thể:
hiểu đây là intent mở,  
gợi ý health plan, work optimization, finance hygiene, learning path, social environment,  
và tạo flow phù hợp mà vẫn giữ quyền đồng ý của người dùng.

---

## 3. Các nguyên tắc bất biến

Toàn bộ code và tài liệu phải tuân thủ 12 nguyên tắc sau.

### 3.1 Mọi object bắt buộc có 4 trường lõi
MeaningID  
Intent  
ConsentChain  
EvidenceRecord

### 3.2 Không có AI tự do
Không agent nào được actuation ra thế giới thật mà không có scope, boundary, audit, rollback.

### 3.3 Local autonomy trước central sync
Mất mạng vẫn phải chạy được ở mức cục bộ.

### 3.4 Evidence first
Mọi hành động quan trọng phải để lại bằng chứng có cấu trúc.

### 3.5 Human sovereignty
Con người có quyền veto, disconnect, override.

### 3.6 Policy before execution
Mọi execution đều phải đi qua policy check.

### 3.7 Trust before federation
Không đồng bộ hoặc không chấp nhận lệnh từ node khác nếu trust state không đạt chuẩn.

### 3.8 Rollback before rollout
Tính rollback phải được thiết kế trước rollout.

### 3.9 Fractal architecture
Mỗi cá nhân, gia đình, doanh nghiệp, cộng đồng, thành phố, habitat đều là một mini-NOOS.

### 3.10 Multi-language by design
Không coi tiếng Anh là trung tâm. Tất cả phải hướng tới đa ngôn ngữ ngay từ kiến trúc.

### 3.11 Degraded mode is mandatory
Mọi module quan trọng đều phải có degraded mode, không chỉ happy path.

### 3.12 Near-term và frontier phải tách rõ
DEV chỉ code các năng lực triển khai được gần hạn. Các công nghệ dài hạn chỉ xuất hiện dưới dạng interface hoặc experimental placeholder.

---

## 4. Tầm nhìn 3 chân trời triển khai

### 4.1 Giai đoạn 1: 2026–2030
Mục tiêu là dựng được lõi chạy thật.

Phải có:
Language Engine bản đầu  
Ontology Engine  
Trust Engine  
Twin Engine bản nền  
Flow Engine chạy thật  
Web dashboard  
Super App web shell  
Map nền  
D1 schema  
Cloudflare deployment  
Audit trail  
Consent management  
Offline-friendly execution ở mức cơ bản

### 4.2 Giai đoạn 2: 2030–2036
Mở rộng sang:
edge nodes  
device orchestration  
multi-tenant organizations  
robotics-ready API  
microgrid intelligence  
advanced map layers  
agent marketplace nội bộ  
federated twins  
NTN-ready assumptions  
DTN-friendly workflows

### 4.3 Giai đoạn 3: 2036–2126
Mở rộng hệ sống quy mô lớn:
city twins  
national knowledge graph  
planetary care systems  
health twin ecosystems  
large-scale simulation  
advanced autonomy with strict governance

### 4.4 Giai đoạn 4: 2126–3026
Đây là horizon, không phải backlog hiện tại.  
Giữ ở mức triết lý hệ thống, interface, naming, protocol compatibility.  
Không để dev hiểu nhầm đây là feature sprint.

---

## 5. Phân lớp kiến trúc tổng thể

### 5.1 Layer 0 — Universal Language Fabric
Đây là trái tim nhận thức của NOOS.

Nó gồm:
Natural Language Layer  
Semantic Layer  
Intent Layer  
Logic Layer  
Execution Bridge

### 5.2 Governance Layer
Policy envelopes  
ethical boundaries  
consent rules  
override pathways  
review rights

### 5.3 Control Layer
Mission graph  
coordination  
orchestration  
twin federation  
system state

### 5.4 FLOW Execution Layer
Workflow runtime  
queues  
steps  
approvals  
retries  
rollback  
logs

### 5.5 Backbone Layer
Connectivity assumptions  
sync rules  
event transport  
distributed resilience  
future NTN / DTN compatibility

### 5.6 Field Layer
Devices  
edge nodes  
sensors  
robotics  
industrial connectors  
energy systems  
mobility systems

### 5.7 Experience Layer
Web  
mobile  
operator console  
admin console  
map console  
AI companion  
input bar

---

## 6. Những gì DEV phải hiểu trước khi code

NOOS không phải build theo feature lẻ.  
Phải build theo engine.

Sai là:
làm chat trước, map sau, flow sau, database sau, policy sau.

Đúng là:
xây engine  
định nghĩa object model  
định nghĩa schema  
mở API  
dựng UI bám engine  
sau đó mới thêm module

Cụ thể:
Language Engine không phải translation app.  
Map Engine không phải map UI đơn thuần.  
Twin Engine không phải cache JSON.  
Trust Engine không phải trang settings.  
FLOW không phải chỉ drag and drop builder.

---

## 7. Bộ engine bắt buộc

Toàn hệ phải có tối thiểu 8 engine.

### 7.1 Language Engine
Chức năng:
parse text, voice transcript, multimodal inputs  
map sang meaning  
map sang intent  
resolve ambiguity  
track context  
attach emotional or cultural signals nếu có

File lõi:
semantic-graph.ts  
intent-parser.ts  
context-engine.ts  
cultural-layer.ts  
meaning-registry.ts

### 7.2 Ontology Engine
Chức năng:
quản lý object types  
relationships  
constraints  
taxonomy  
domain extensions

File lõi:
human.json  
asset.json  
device.json  
energy.json  
biology.json  
governance.json  
mission.json  
risk.json

### 7.3 Twin Engine
Chức năng:
tạo và duy trì digital twin  
lưu state  
state history  
prediction  
simulation hooks  
sync policy  
delta updates

File lõi:
twin-core.ts  
twin-store.ts  
twin-sync.ts  
twin-events.ts  
twin-simulator.ts

### 7.4 Flow Engine
Chức năng:
workflow definitions  
execution runtime  
step runner  
conditions  
approval queue  
retry policy  
rollback policy  
execution logs

File lõi:
flow-builder.ts  
flow-runtime.ts  
flow-queue.ts  
flow-steps.ts  
flow-rollback.ts  
flow-evidence.ts

### 7.5 Trust Engine
Chức năng:
identity  
consent  
attestation  
evidence  
audit trails  
policy verification  
risk state

File lõi:
identity.ts  
consent.ts  
attestation.ts  
evidence.ts  
audit.ts  
trust-score.ts

### 7.6 Map Engine
Chức năng:
fractal map layers  
overlay rendering  
twin visualization  
risk visualization  
mission visualization  
timeline playback

File lõi:
map-core.ts  
map-layers.ts  
twin-renderer.ts  
risk-overlay.ts  
mission-overlay.ts  
zoom-fractal.ts

### 7.7 Device Engine
Chức năng:
device registry  
telemetry ingestion  
firmware policy  
edge logic  
heartbeat  
local execution  
device trust

File lõi:
device-registry.ts  
telemetry.ts  
firmware-policy.ts  
edge-runtime.ts  
device-heartbeat.ts

### 7.8 Experience Engine
Chức năng:
unified input surface  
adaptive UI  
web shell  
mobile shell  
session state  
language preferences  
personalized surfaces

File lõi:
app-shell.ts  
input-bar.ts  
session-store.ts  
adaptive-layout.ts  
surface-router.ts

---

## 8. Repo structure chuẩn duy nhất

```text
/noos-system
  README.md
  NOOS_MASTER_IMPLEMENTATION_GUIDE.md
  package.json
  wrangler.jsonc
  tsconfig.json
  .gitignore

  /apps
    /web
      index.html
      app.js
      style.css
      manifest.json
      sw.js
      /assets
      /components
      /pages
    /mobile
      README.md
      app-architecture.md

  /core
    /language-engine
    /ontology
    /twin
    /trust
    /governance

  /flow-engine
    /runtime
    /builder
    /queue
    /steps
    /logs

  /map-system
    /engine
    /layers
    /renderers

  /agents
    /planner
    /executor
    /auditor

  /device
    /firmware
    /edge-runtime
    /hardware-spec

  /data
    /schemas
    /seed
    /fixtures

  /workers
    /api
    /cron
    /queues

  /docs
    /architecture
    /api
    /ontology
    /security
    /roadmap
    /dev-guides

  /infra
    /cloudflare
    /migrations
    /scripts
```

Không tự ý bẻ repo thành cấu trúc ngẫu nhiên khi chưa đi qua engine map này.

---

## 9. Object model chuẩn

### 9.1 BaseEntity
Mọi thực thể trong NOOS kế thừa từ BaseEntity.

Trường bắt buộc:
id  
type  
name  
meaning_id  
intent_default  
consent_required  
trust_level  
status  
metadata  
created_at  
updated_at

### 9.2 Intent
Trường:
id  
source_type  
source_ref  
meaning_id  
intent_code  
intent_payload  
context_json  
priority  
risk_level  
requires_approval  
created_at

### 9.3 ConsentChain
Trường:
id  
entity_id  
subject_id  
scope  
granted_by  
granted_at  
expires_at  
revoked_at  
proof_ref

### 9.4 EvidenceRecord
Trường:
id  
action_type  
actor_type  
actor_ref  
entity_ref  
flow_ref  
event_ref  
summary  
payload_json  
hash  
created_at

### 9.5 DigitalTwin
Trường:
id  
entity_id  
twin_type  
state_json  
prediction_json  
health_score  
risk_score  
last_synced_at

### 9.6 PolicyEnvelope
Trường:
id  
policy_code  
scope  
constraints_json  
approval_mode  
rollback_required  
severity  
active

### 9.7 DeviceNode
Trường:
id  
device_type  
model  
firmware_version  
trust_state  
location_ref  
last_seen_at  
telemetry_state

### 9.8 AgentProfile
Trường:
id  
agent_type  
capabilities_json  
allowed_scopes  
approval_rules  
trust_state  
active

---

## 10. Language Fabric chi tiết để DEV hiểu đúng

### 10.1 Natural Language Layer
Nhận input từ:
text  
voice transcript  
camera OCR nếu cần  
sensor-derived hints  
future neural-safe signals

Yêu cầu:
phải hỗ trợ đa ngôn ngữ  
phải lưu original_text  
phải có locale  
phải có source channel

### 10.2 Semantic Layer
Đây là trái tim.

Nó không làm translation.  
Nó làm semantic normalization.

Mỗi khái niệm có:
MeaningID  
canonical label  
aliases  
language variants  
domain tags  
relations  
cultural variance  
emotional valence  
constraint hints

Ví dụ:
concept:safe_housing_001

Có thể có:
canonical_label = Safe Housing  
aliases = nhà an toàn, safe home, secure shelter  
domain = housing, safety, family  
relations = is-a housing_need, linked-to family_security  
cultural_variance = mức ưu tiên riêng tư, cộng đồng, pháp lý theo vùng

### 10.3 Intent Layer
Biến semantic object thành ý định chạy được.

Ví dụ:
SAFE_HOUSING  
FIND_DOCTOR  
OPTIMIZE_ENERGY_USAGE  
REPORT_RISK  
PLAN_LEARNING_PATH

### 10.4 Logic Layer
Điều phối:
intent → policy check → flow template → approvals → execution graph

### 10.5 Execution Bridge
Tạo flow_ref, attach evidence, handoff to FLOW runtime.

---

## 11. Semantic Layer cần chi tiết hơn nữa

Đây là phần dev thường hiểu thiếu.  
Phải có 6 thành phần:

Meaning Registry  
Relation Engine  
Context Resolver  
Cultural Variance Model  
Intent Bridge  
Evidence Linker

### 11.1 Meaning Registry
Lưu canonical concepts.

### 11.2 Relation Engine
Các loại relation tối thiểu:
is-a  
part-of  
causes  
depends-on  
owned-by  
regulated-by  
supports  
conflicts-with  
risk-for  
requires

### 11.3 Context Resolver
Giải nghĩa theo:
thời gian  
địa điểm  
lĩnh vực  
hội thoại trước đó  
vai trò người dùng  
thiết bị đang dùng

Ví dụ chữ “nhà” có thể là:
home  
state  
factory  
discipline  
institution

### 11.4 Cultural Variance Model
Một semantic object có biến thể văn hóa.  
Không được hardcode một nghĩa phương Tây rồi áp lên toàn hệ.

### 11.5 Intent Bridge
Chỉ semantic mà không ra intent thì vô dụng.  
Meaning phải map sang action space.

### 11.6 Evidence Linker
Mọi semantic quan trọng phải nối được tới:
policy  
flow  
twin  
event  
risk  
evidence

---

## 12. BCI và NUL: cách viết đúng cho DEV

Phần này chỉ để chuẩn bị interface, không phải sprint thương mại ngay.

Phân 3 mức:

### 12.1 Mức 1 — Neuro-adjacent input
Eye tracking  
attention proxies  
stress patterns  
gesture  
physiological signals

Đây là thứ có thể bắt đầu trước.

### 12.2 Mức 2 — Non-surgical neural interface ready hooks
Tạo interface abstraction:
NeuralInputAdapter  
NeuralConsentGate  
NeuralFeedbackChannel

### 12.3 Mức 3 — Future thought-intent bridge
Chỉ để placeholder protocol:
thought pattern → semantic candidates → intent candidates → explicit consent check

Quy tắc bắt buộc:
voluntary  
revocable  
disconnectable

Không được để dev hiểu rằng NOOS hiện tại đang thương mại hóa mind decoding.

---

## 13. Flow Engine phải mạnh như thế nào

FLOW là phần phải chạy được sớm nhất.

### 13.1 Mỗi flow gồm
flow definition  
trigger  
steps  
conditions  
approvals  
fallback path  
rollback path  
evidence hooks

### 13.2 Mỗi execution gồm
execution_id  
flow_id  
status  
step_index  
input_json  
output_json  
logs  
errors  
started_at  
ended_at

### 13.3 Trạng thái tối thiểu
draft  
validated  
ready  
queued  
running  
waiting_approval  
success  
failed  
rolled_back  
cancelled

### 13.4 Step types
transform  
fetch  
decide  
notify  
wait  
human_approval  
device_command  
agent_task  
log  
rollback

### 13.5 Bắt buộc phải có
validation trước run  
dry run  
preview  
rollback simulation  
manual stop  
audit export

---

## 14. Super App định nghĩa đúng

Super App không phải hàng chục menu.

Nó là một input surface thống nhất.

Core UX:
một ô nhập trung tâm  
voice button  
camera button  
map button  
context suggestions  
activity stream  
trust/consent indicator

### 14.1 9 module lõi
Identity  
AI Companion  
Universal Search  
Flow  
Twin  
Map  
Governance  
Economy  
Learning

### 14.2 4 màn hình nền
Home  
Map  
Flows  
Profile

### 14.3 4 lớp hiển thị
User view  
Operator view  
Admin view  
Audit view

### 14.4 Nguyên tắc UI
không buộc người dùng học hệ  
hệ học người dùng  
mọi giao diện phải hiển thị trust state  
mọi hành động quan trọng phải cho thấy consent scope  
mỗi module phải quay về cùng một input bar trung tâm

---

## 15. Super Map phải được định nghĩa như control surface

Không chỉ là bản đồ xem.

### 15.1 10 lớp map
Life  
Asset  
Infrastructure  
Energy  
Knowledge  
Risk  
Future  
Governance  
Trust  
Mission

### 15.2 Các khả năng bắt buộc
pan  
zoom  
fractal zoom  
layer toggle  
timeline playback  
filter by entity  
filter by trust  
filter by risk  
flow overlays  
incident overlays

### 15.3 Fractal principle
Zoom vào một người thì thấy:
life, health, history, consent, tasks, twin state

Zoom ra một gia đình:
relationships, home, devices, energy, finance

Zoom ra một cộng đồng:
shared assets, flows, risks, map layers

Zoom ra thành phố:
infrastructure, governance, missions, environmental data

### 15.4 Các view cần có
now view  
risk view  
history view  
prediction view  
mission view

---

## 16. Trust Engine phải đi cùng mọi thứ

Trust không phải module riêng ở cuối.

### 16.1 Thành phần
Identity registry  
Consent manager  
Attestation ledger  
Evidence store  
Audit explorer  
Trust score model

### 16.2 Mỗi request API quan trọng phải attach
actor identity  
scope  
consent status  
policy result  
evidence link

### 16.3 Mỗi device phải có
device identity  
firmware version  
attestation state  
heartbeat  
trust state

### 16.4 Mỗi agent phải có
agent profile  
allowed scopes  
approval mode  
logging level  
kill switch

---

## 17. Device family để dev không bị mơ hồ

### 17.1 Personal
Life Band  
Life Pin  
Life Glass

### 17.2 Home/Habitat
Habitat Hub  
Habitat Sense Grid  
Habitat Vault

### 17.3 Mobility
Mobility Node  
Fleet Beacon

### 17.4 Field
Earth Node  
Field Relay  
Environmental Sensor Cluster

### 17.5 Industrial
Plant Node  
Industrial Gateway  
Robot Dock Controller

### 17.6 Ưu tiên 2026–2030
Habitat Hub  
Earth Node  
Grid Brain  
Life Band  
Mobility Node

Phần device hiện tại được implement bằng:
registry  
telemetry  
simulator  
mock command channel  
hardware spec docs

Không cần chờ có hardware thật mới code.

---

## 18. Database schema tối thiểu

### 18.1 Bảng entities
id  
type  
name  
meaning_id  
status  
metadata_json  
created_at  
updated_at

### 18.2 Bảng intents
id  
entity_id  
meaning_id  
intent_code  
payload_json  
context_json  
status  
priority  
requires_approval  
created_at

### 18.3 Bảng flows
id  
name  
intent_code  
definition_json  
status  
version  
created_at

### 18.4 Bảng flow_executions
id  
flow_id  
intent_id  
status  
current_step  
input_json  
output_json  
error_json  
started_at  
ended_at

### 18.5 Bảng twins
id  
entity_id  
twin_type  
state_json  
prediction_json  
risk_score  
health_score  
last_synced_at

### 18.6 Bảng consents
id  
subject_id  
entity_id  
scope  
granted_by  
granted_at  
expires_at  
revoked_at  
proof_ref

### 18.7 Bảng evidence
id  
action_type  
actor_ref  
entity_ref  
flow_ref  
summary  
payload_json  
hash  
created_at

### 18.8 Bảng devices
id  
device_type  
model  
firmware_version  
trust_state  
location_json  
last_seen_at  
telemetry_json

### 18.9 Bảng agents
id  
agent_type  
profile_json  
allowed_scopes_json  
trust_state  
active  
updated_at

### 18.10 Bảng policies
id  
policy_code  
scope  
constraints_json  
severity  
active  
updated_at

---

## 19. API design duy nhất nên dùng

Base prefix:
`/api`

### 19.1 Language APIs
POST /api/parse  
POST /api/resolve-context  
GET /api/meaning/:id  
POST /api/intent/infer

### 19.2 Flow APIs
GET /api/flows  
POST /api/flows  
POST /api/flow/run  
GET /api/executions/:id  
POST /api/executions/:id/rollback  
POST /api/executions/:id/cancel

### 19.3 Twin APIs
GET /api/twins/:id  
POST /api/twins  
POST /api/twins/:id/update  
GET /api/entities/:id/twin

### 19.4 Consent APIs
POST /api/consents  
GET /api/consents/:id  
POST /api/consents/:id/revoke

### 19.5 Evidence APIs
GET /api/evidence/:id  
GET /api/entities/:id/evidence  
GET /api/executions/:id/evidence

### 19.6 Map APIs
GET /api/map/layers  
GET /api/map/view  
POST /api/map/query

### 19.7 Device APIs
GET /api/devices  
POST /api/devices/register  
POST /api/devices/:id/telemetry  
POST /api/devices/:id/command

### 19.8 Agent APIs
GET /api/agents  
POST /api/agents/run  
POST /api/agents/:id/disable

---

## 20. UI/UX implementation requirements

### 20.1 Web shell tối thiểu
index.html  
style.css  
app.js  
manifest.json  
sw.js

### 20.2 Thành phần UI tối thiểu
global header  
input bar  
activity stream  
module cards  
map surface  
execution panel  
consent panel  
evidence panel  
profile panel

### 20.3 Mobile-first rules
responsive từ đầu  
không làm desktop rồi co lại  
touch targets lớn  
offline-friendly  
safe-area support

### 20.4 Design language
sang trọng  
tối giản  
có chiều sâu  
tập trung vào clarity  
không rối tính năng

---

## 21. Hạ tầng triển khai

### 21.1 Cloudflare stack khuyến nghị
Workers cho API  
D1 cho relational data  
R2 cho storage  
Queues cho async jobs  
Pages hoặc static assets cho web shell  
Cron cho maintenance tasks

### 21.2 Cần có các binding
DB  
ASSETS  
QUEUE  
ENV flags

### 21.3 Môi trường
local  
staging  
production

### 21.4 Secret management
không hardcode secret  
tách env  
sử dụng secret bindings

---

## 22. Test plan bắt buộc

### 22.1 Unit tests
parser  
intent inference  
policy checks  
flow step handlers  
consent validation

### 22.2 Integration tests
parse → intent → flow creation  
flow run → evidence write  
device telemetry → twin update  
consent revoke → block execution

### 22.3 Simulation tests
offline mode  
queue backlog  
high latency  
partial failures  
rollback path  
device unavailable

### 22.4 Degraded mode tests
mất kết nối  
mất DB tạm thời  
queue chậm  
map layer lỗi  
agent timeout

### 22.5 Long-latency test
Phải có test profile “Mars latency simulation” chỉ để ép hệ logic không phụ thuộc phản hồi ngay lập tức.

---

## 23. Security checklist bắt buộc

Identity everywhere  
consent checks everywhere  
audit everywhere  
least privilege  
kill switches  
manual overrides  
rate limits  
input validation  
signed events khi cần  
tamper-evident evidence chain  
future PQC-ready abstraction

### 23.1 Không được thiếu
auth boundary  
role checks  
tenant separation  
input sanitization  
device trust validation  
agent scope restrictions

---

## 24. Tài liệu con bắt buộc trong repo

Ngay cả khi đã có file master này, dev vẫn phải sinh ra docs con.

`/docs/architecture/system-overview.md`  
`/docs/architecture/language-fabric.md`  
`/docs/architecture/flow-engine.md`  
`/docs/architecture/trust-engine.md`  
`/docs/architecture/super-map.md`  
`/docs/api/openapi.yaml`  
`/docs/security/security-checklist.md`  
`/docs/dev-guides/local-setup.md`

File master này là gốc.  
Các docs con là diễn giải theo module.

---

## 25. Build order duy nhất

### Phase 1 — Foundation
setup repo  
setup Cloudflare  
setup D1  
setup base web shell  
setup API worker  
setup schema  
setup seed data

### Phase 2 — Language + Trust
semantic registry  
parse endpoint  
intent endpoint  
consent manager  
evidence write path

### Phase 3 — Flow
flow definitions  
runtime  
execution log  
approval queue  
rollback engine

### Phase 4 — Twin + Map
entity twin  
twin update  
map layers  
fractal zoom  
risk overlays

### Phase 5 — Super App
input bar  
home dashboard  
flow screen  
map screen  
profile + consent screen

### Phase 6 — Devices + Agents
device registry  
telemetry ingestion  
agent planner  
agent executor  
agent auditor

### Phase 7 — Federation readiness
sync policies  
offline/export  
event envelopes  
future NTN/DTN abstractions

Không đổi thứ tự nếu chưa có lý do kỹ thuật rất rõ.

---

## 26. Deliverables theo mốc

### 26.1 Trong 7 ngày đầu
Repo chạy local  
Worker chạy  
D1 chạy  
Web shell mở được  
README rõ  
guide local setup có

### 26.2 Trong 30 ngày
parse endpoint chạy  
intent inference chạy  
flow runtime cơ bản chạy  
consent manager có  
evidence ghi được  
map nền hiển thị

### 26.3 Trong 60 ngày
super app shell usable  
twin update usable  
flow + map liên kết được  
profile + consent usable  
audit panel usable

### 26.4 Trong 90 ngày
device mock usable  
agent planner usable  
execution monitoring usable  
rollback usable  
degraded mode test có kết quả

---

## 27. Những gì AI assistant code phải tuân thủ

Nếu dùng AI hỗ trợ code, prompt cho AI phải nhấn mạnh:

viết file hoàn chỉnh  
không trả diff rời rạc  
không để TODO vô nghĩa  
không hardcode dữ liệu nhạy cảm  
không bỏ qua error handling  
phải có type rõ  
phải có comment đủ dùng  
phải bám repo structure chuẩn  
phải bám object model của NOOS

---

## 28. Definition of done

Một module chỉ được coi là xong khi:

code chạy  
có test tối thiểu  
có logs  
có docs  
có error handling  
có policy checks nếu liên quan  
có evidence hooks nếu liên quan  
không phá các engine khác

---

## 29. Những lỗi lớn phải tránh

Biến NOOS thành chatbot đơn thuần  
Biến FLOW thành task list đơn thuần  
Biến Super Map thành map UI đơn thuần  
Biến Twin thành cache state đơn thuần  
Biến Trust thành form quyền truy cập đơn thuần  
Biến device layer thành IoT dashboard rời rạc

Nếu mắc các lỗi này thì toàn hệ sẽ mất bản sắc ngay từ đầu.

---

## 30. Tuyên bố chốt cho DEV

NOOS không xây theo tư duy app thông thường.  
NOOS xây theo tư duy hạ tầng nhận thức.

FLOW không phải tiện ích phụ.  
FLOW là động cơ thực thi.

Super App không phải chồng tính năng.  
Super App là giao diện tối giản cho một hệ cực lớn.

Map không phải phần minh họa.  
Map là bề mặt nhận thức và điều phối.

Trust không phải cài thêm sau.  
Trust là một phần của mọi object, mọi API, mọi execution.

---

## 31. Câu chốt cuối cùng

Không build feature.  
Chỉ build hệ.

Không build màn hình trước.  
Chỉ build engine trước rồi mới mở giao diện.

Không build app rời rạc.  
Chỉ build lớp điều phối thống nhất.

NOOS là lớp điều phối của toàn bộ thực tại có thể hiểu được.  
Mọi quyết định kỹ thuật từ đây trở đi phải phục vụ câu đó.

---

## 32. Hành động ngay sau khi đọc file này

1. Tạo repo đúng cấu trúc chuẩn.  
2. Tạo README và file master này ở root.  
3. Setup Worker + D1 + web shell.  
4. Tạo schema bảng lõi.  
5. Mở parse endpoint đầu tiên.  
6. Mở flow runtime đầu tiên.  
7. Mở consent + evidence path đầu tiên.  
8. Dựng home shell + input bar.  
9. Dựng map surface đầu tiên.  
10. Chỉ sau đó mới mở rộng devices, agents, federation.

---

Hết file.
