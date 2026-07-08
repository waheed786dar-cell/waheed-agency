#!/usr/bin/env python3
"""
Properly fixes internal links to be relative to each file's own location,
so the exact same HTML works at:
  - domain root (Vercel: waheed-agency.vercel.app/pages/about.html)
  - a subfolder (GitHub Pages: username.github.io/waheed-agency/pages/about.html)

Strategy: every internal href/src is resolved against a known "site root"
path (e.g. "pages/about.html", "css/main.css", "index.html"), then rewritten
as a path relative to the CURRENT file's own folder using os.path.relpath.
"""
import re
import os

FILES = [
    '404.html',
    'index.html',
    'pages/about.html',
    'pages/blog.html',
    'pages/careers.html',
    'pages/contact.html',
    'pages/faq.html',
    'pages/legal/privacy-policy.html',
    'pages/legal/terms-of-service.html',
    'pages/portfolio/case-study-template.html',
    'pages/portfolio/index.html',
    'pages/services/app-development.html',
    'pages/services/cloud-devops.html',
    'pages/services/index.html',
    'pages/services/seo-marketing.html',
    'pages/services/ui-ux-design.html',
    'pages/services/web-development.html',
]

def normalize_target(path):
    """Strip any leading ../ or / to get the canonical site-root-relative path."""
    path = path.lstrip('/')
    while path.startswith('../'):
        path = path[3:]
    return path

def fix_file(filepath):
    file_dir = os.path.dirname(filepath)  # '' for root files, 'pages' for pages/about.html, etc.

    with open(filepath, 'r') as f:
        content = f.read()
    original = content

    def replace_link(match):
        attr = match.group(1)
        raw_path = match.group(2)

        # Skip external links, anchors, mailto, tel
        if raw_path.startswith(('http://', 'https://', '//', '#', 'mailto:', 'tel:')):
            return match.group(0)

        # Handle bare "/" (home link)
        if raw_path == '/':
            target = 'index.html'
        else:
            target = normalize_target(raw_path)

        if file_dir == '':
            rel = target
        else:
            rel = os.path.relpath(target, file_dir)

        return f'{attr}="{rel}"'

    content = re.sub(r'(href|src)="([^"]*)"', replace_link, content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

changed = []
for f in FILES:
    if fix_file(f):
        changed.append(f)

print(f"Fixed: {len(changed)} files")
for f in changed:
    print(f"  - {f}")
