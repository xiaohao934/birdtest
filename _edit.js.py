from pathlib import Path
path = Path("script.js")
text = path.read_text(encoding="utf-8")
old = "function beginQuiz() {\n  if (heroEl) {\n    heroEl.hidden = true;\n  }\n  quizPanel.hidden = false;\n  startNewQuiz();\n  quizPanel.scrollIntoView({ behavior: 'smooth' });\n}\n"
new = "function beginQuiz() {\n  if (heroEl) {\n    heroEl.setAttribute('hidden', 'true');\n  }\n  if (quizPanel) {\n    quizPanel.removeAttribute('hidden');\n  }\n  startNewQuiz();\n  quizPanel?.scrollIntoView({ behavior: 'smooth' });\n}\n"
if old not in text:
    raise SystemExit('beginQuiz block not found')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
