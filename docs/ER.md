# 🤩 Entity Relationship Summary

### 🔍 Summary

- A **User** has many **Goals**, **BankAccounts**, **Transactions**, **Rewards**, **Sessions**, and **Auth Accounts**
- A **BankAccount** belongs to one **User** and has many **Transactions**
- A **Transaction** is linked to one **User** and one **BankAccount**
- A **Goal** and a **Reward** belong to one **User**

### 🗂 Legend

- `PK` = Primary Key
- `FK` = Foreign Key
- `||--o{` = One-to-many relationship

## 🧬 Mermaid Diagram

```mermaid
erDiagram
    User ||--o{ BankAccount : has
    User ||--o{ Goal : has
    User ||--o{ Reward : has
    User ||--o{ Transaction : makes
    User ||--o{ Session : has
    User ||--o{ Account : authenticates_with

    BankAccount ||--o{ Transaction : has

    User {
        String id PK
        String name
        String email
        String password
        String image
        DateTime emailVerified
        DateTime createdAt
        DateTime updatedAt
    }

    BankAccount {
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
        String userId FK
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

    Account {
        String id PK
        String userId FK
        String type
        String provider
        String providerAccountId
        String refresh_token
        String access_token
        Int expires_at
        String token_type
        String scope
        String id_token
        String session_state
        DateTime createdAt
        DateTime updatedAt
    }

    Session {
        String sessionToken PK
        String userId FK
        DateTime expires
        DateTime createdAt
        DateTime updatedAt
    }

    VerificationToken {
        String identifier PK
        String token PK
        DateTime expires
    }
```
