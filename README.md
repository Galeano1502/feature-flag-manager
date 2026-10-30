# 🚀 Feature Flag & Dynamic Configuration Manager

Um sistema distribuído de **Feature Flags e Configuração Dinâmica** em tempo real, projetado para suportar práticas modernas de engenharia de software como **Continuous Delivery** e **Trunk-Based Development**.

O projeto utiliza uma arquitetura separada em **Control Plane** (API em Go) e **Data Plane** (SDK em TypeScript), garantindo invalidação de cache em sub-milissegundos via **Redis Pub/Sub** e avaliação determinística de regras.

---

## 🏗️ Arquitetura do Sistema

```text
[ Admin / CI/CD ] ──(HTTP POST)──> [ Go Control Plane API ]
                                            │
                                            ├──(Publish Event)──> [ Redis Pub/Sub ]
                                            │                            │
                                     (Persistência)                      │ (Sub-ms Notification)
                                            │                            ▼
                                    [ Postgres DB ]          [ Node.js / TS Client SDK ]
                                                               (Local In-Memory Cache)