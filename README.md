
# Full-Spectrum-Web-App-Hardening

This repository contains a hardened version of a deliberately vulnerable Node.js / Express web application.
The goal of this project is to demonstrate:
- Identification of vulnerabilities using DAST (OWASP ZAP)
- Identification of vulnerabilities using SAST (Semgrep)
- Secure remediation and hardening
- Proof that vulnerabilities are eliminated after fixes

---

## 1️⃣ Requirements

Ensure you have the following installed:

- Node.js (Recommended v18+)
- npm
- Git
- OWASP ZAP (Desktop)
- Semgrep CLI

---

## 2️⃣ Installation

Clone the repository:

```
git clone https://github.com/abdelrahaman-sameh03/Full-Spectrum-Web-App-Hardening.git
cd Full-Spectrum-Web-App-Hardening
```

Install dependencies:

```
npm install
```

Create environment file:

```
copy .env.example .env
```

Edit `.env` values if needed.

---

## 3️⃣ Run the Application

Start the server:

```
npm start
```

Or (development hot reload):

```
npm run dev
```

Server should run on:

```
http://localhost:5000
```

---

## 4️⃣ Running OWASP ZAP (DAST)

### Option 1 – Manual Spider + Attack

1️⃣ Open OWASP ZAP  
2️⃣ Enter target:
```
http://localhost:5000
```
3️⃣ Run:
- Spider Scan
- Active Scan

4️⃣ Notice findings (before fixes)  
5️⃣ After fixes → re-run and verify issues are gone

---

## 5️⃣ Running Semgrep (SAST)

### Install Semgrep

```
pip install semgrep
```
or
```
choco install semgrep
```
or
```
brew install semgrep
```

---

### Run Base Security Rules (Phase B1)

```
semgrep --config "p/javascript" --config "p/nodejs" --error
```

---

### Run Custom Rules (Phase B3)

Custom rules exist inside:

```
semgrep-rules/
```

Run them:

```
semgrep --config semgrep-rules/ --error
```

Before fixing → rules should detect vulnerabilities  
After fixing → findings should disappear or reduce

---

## 6️⃣ Project Structure

```
src/
  router/
  middleware/
  controllers/
semgrep-rules/
.env.example
README.md
package.json
```

---

## 7️⃣ What Was Done in This Project

✔ DAST scan using OWASP ZAP  
✔ SAST scan using Semgrep  
✔ Mapping DAST → Code → Semgrep  
✔ Implemented security fixes  
✔ Re-ran DAST & SAST to prove remediation  
✔ Added custom Semgrep rules  
✔ Ensured app stability after hardening  

---

## 8️⃣ Notes

- No real secrets are stored in the repository
- `.env` contains only safe placeholders
- Custom Semgrep rules are written to detect the previously vulnerable patterns

---

## 9️⃣ Author

**Abdelrahman Sameh**

Secure Software Engineering – Full Spectrum Web App Hardening Project
