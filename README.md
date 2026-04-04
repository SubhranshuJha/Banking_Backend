# 💳 Ledger Transaction Backend

A backend system that simulates real‑world financial transfers between accounts using a **ledger‑based architecture**.
It ensures every transaction is safely processed, recorded immutably, and reflected correctly in balances.

---

##  What This Project Does

* Create accounts with balances
* Transfer money between accounts
* Record every debit & credit in a ledger
* Prevent duplicate transfers using idempotency keys
* Keep balances consistent with atomic database transactions

---

##  Core Idea

Instead of directly changing balances, the system records **ledger entries** for each transaction:

* Sender → DEBIT entry
* Receiver → CREDIT entry

This mimics how real banking systems maintain financial integrity.

---

##  Key Features

* Double‑entry ledger system
* Idempotent transaction processing
* MongoDB transaction safety
* Account balance validation
* Transaction history tracking

---

##  Tech Stack

Node.js • Express • MongoDB • Mongoose

---

## 👨‍💻 Author

Subhranshu Jha
GEC Gandhinagar — IT
