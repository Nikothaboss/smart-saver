# 🧩 Entity Relationship Summary

### 🔍 Summary

- A **User** has many **Accounts**, **Goals**, and **Rewards**
- An **Account** belongs to one **User** and has many **Transactions**
- A **Transaction** is linked to one **Account**
- A **Goal** and a **Reward** belong to one **User**

### 🗂 Legend

- `PK` = Primary Key
- `FK` = Foreign Key
- `||--o{` = One-to-many relationship

## Mermaid Diagram

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Goal : has
    User ||--o{ Reward : has
    Account ||--o{ Transaction : has

    User {
        String id PK
        String name
        String email
        DateTime createdAt
        DateTime updatedAt
    }

    Account {
        String id PK
        String accountNumber
        String accountType
        Float balance
        Currency currency
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Transaction {
        String id PK
        DateTime date
        String description
        Float amount
        Currency currency
        String accountId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Goal {
        String id PK
        String title
        Float targetAmount
        Float currentAmount
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Reward {
        String id PK
        String title
        Boolean unlocked
        String userId FK
        DateTime createdAt
        DateTime updatedAt
    }
```
