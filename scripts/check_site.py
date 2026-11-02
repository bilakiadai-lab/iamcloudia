"""Vérifications du site statique (dossier site/).

1. Structure HTML : balises non fermées ou mal imbriquées.
2. Liens internes : fichiers et ancres (#id) qui existent.
3. Contenu à compléter : texte entre crochets, ex. [numéro].
   - Avertissement par défaut.
   - Erreur si STRICT_PLACEHOLDERS=1 (pull request vers main).

Usage : python scripts/check_site.py [dossier]   (par défaut : site)
"""
import os
import re
import sys
from html.parser import HTMLParser

SITE = sys.argv[1] if len(sys.argv) > 1 else "site"
STRICT = os.environ.get("STRICT_PLACEHOLDERS") == "1"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
PLACEHOLDER = re.compile(r"\[[A-ZÀ-Ýa-zà-ÿ][^\]\[<>{}]{1,60}\]")


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors, self.ids, self.links = [], [], set(), []
        self.text, self.skip = [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            self.links.append((a["href"], self.getpos()[0]))
        if tag in ("script", "style"):
            self.skip += 1
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
        if not self.stack:
            self.errors.append(f"ligne {self.getpos()[0]} : </{tag}> sans balise ouvrante")
            return
        open_tag, line = self.stack[-1]
        if open_tag == tag:
            self.stack.pop()
            return
        if any(t == tag for t, _ in self.stack):
            while self.stack and self.stack[-1][0] != tag:
                t, l = self.stack.pop()
                self.errors.append(f"ligne {l} : <{t}> non fermée avant </{tag}> (ligne {self.getpos()[0]})")
            self.stack.pop()
        else:
            self.errors.append(f"ligne {self.getpos()[0]} : </{tag}> ne correspond à aucune balise ouverte")

    def handle_data(self, data):
        if not self.skip:
            self.text.append((data, self.getpos()[0]))


def main():
    pages = sorted(f for f in os.listdir(SITE) if f.endswith(".html"))
    parsed = {}
    errors, warnings = [], []
    for name in pages:
        p = Page()
        p.feed(open(os.path.join(SITE, name), encoding="utf-8").read())
        p.close()
        for t, l in p.stack:
            if t not in ("html", "body", "head"):
                p.errors.append(f"ligne {l} : <{t}> jamais fermée")
        errors += [f"{name} {e}" for e in p.errors]
        parsed[name] = p

    for name, p in parsed.items():
        for href, line in p.links:
            if re.match(r"^(https?:|mailto:|tel:|sms:|//)", href):
                continue
            path, _, anchor = href.partition("#")
            target = path or name
            if target not in parsed:
                errors.append(f"{name} ligne {line} : lien vers « {href} », fichier introuvable")
            elif anchor and anchor not in parsed[target].ids and anchor not in ("cloud", "ai", "top"):
                errors.append(f"{name} ligne {line} : lien vers « {href} », ancre introuvable")
        for text, line in p.text:
            for m in PLACEHOLDER.finditer(text):
                warnings.append(f"{name} ligne {line} : contenu à compléter {m.group(0)}")

    print(f"Pages vérifiées : {', '.join(pages)}")
    for e in errors:
        print(f"::error::{e}")
    for w in warnings:
        print(f"::{'error' if STRICT else 'warning'}::{w}")
    failed = bool(errors) or (STRICT and bool(warnings))
    print(f"{len(errors)} erreur(s), {len(warnings)} contenu(s) à compléter" + (" (bloquant vers main)" if STRICT and warnings else ""))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
