import { signOut } from './api.js';
import { errorMessage } from './format.js';

/** 建立元素；子節點為字串時一律用 textContent，避免 XSS。 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const EMPLOYEE_NAV = [['home.html', '首頁'], ['wrong.html', '錯題區'], ['records.html', '我的紀錄']];
const SUPERVISOR_NAV = [['supervisor.html', '員工總覽']];

export function renderNav(me, active) {
  const items = me.role === 'supervisor' ? SUPERVISOR_NAV : EMPLOYEE_NAV;
  const nav = h('nav', { class: 'nav' },
    h('strong', { class: 'brand' }, '適任考核'),
    ...items.map(([href, label]) => h('a', { href, class: href === active ? 'active' : '' }, label)),
    h('span', { class: 'spacer' }),
    h('span', { class: 'who' }, `${me.name}（${me.role === 'supervisor' ? '主管' : '員工'}）`),
    h('button', { class: 'btn ghost', onclick: async () => { await signOut(); location.replace('index.html'); } }, '登出'));
  document.body.prepend(nav);
}

export function showError(container, err) {
  const msg = err && err.code ? errorMessage(err.code) : (err && err.message) || '發生未知錯誤';
  container.replaceChildren(h('div', { class: 'notice error', role: 'alert' }, msg));
}

export function setBusy(container, text = '載入中…') {
  container.replaceChildren(h('p', { class: 'muted' }, text));
}
