'use client';

import { useMemo, useState } from 'react';
import type { MenuItem } from '@/lib/api';
import MenuItemCard from './MenuItemCard';
import MenuItemModal from './MenuItemModal';

const ALL_CATEGORY = 'All';

export default function MenuBrowser({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [query, setQuery] = useState('');
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    items.forEach((item) => {
      if (!seen.has(item.category)) { seen.add(item.category); ordered.push(item.category); }
    });
    return ordered;
  }, [items]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesCategory = activeCategory === ALL_CATEGORY || item.category === activeCategory;
    const matchesQuery = !normalizedQuery
      || item.name.toLowerCase().includes(normalizedQuery)
      || item.description.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  }), [items, activeCategory, normalizedQuery]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== ALL_CATEGORY || normalizedQuery) return null;
    const groups = new Map<string, MenuItem[]>();
    filteredItems.forEach((item) => {
      if (!groups.has(item.category)) groups.set(item.category, []);
      groups.get(item.category)!.push(item);
    });
    return Array.from(groups.entries());
  }, [filteredItems, activeCategory, normalizedQuery]);

  const openItem = openItemId ? items.find((item) => item._id === openItemId) ?? null : null;

  function clearFilters() {
    setActiveCategory(ALL_CATEGORY);
    setQuery('');
  }

  if (items.length === 0) {
    return <p className="tv-menu-page__empty">Our menu is being finalized — check back soon.</p>;
  }

  return (
    <div className="tv-menu-page">
      <div className="tv-menu-page__toolbar">
        <div className="tv-menu-page__categories" role="tablist" aria-label="Menu categories">
          <button type="button" role="tab" aria-selected={activeCategory === ALL_CATEGORY} className="tv-menu-pill" data-active={activeCategory === ALL_CATEGORY} onClick={() => setActiveCategory(ALL_CATEGORY)}>All</button>
          {categories.map((category) => (
            <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className="tv-menu-pill" data-active={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>
        <label className="tv-menu-page__search" htmlFor="menu-search">
          <span className="sr-only">Search the menu</span>
          <input id="menu-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the menu…" />
        </label>
      </div>

      {filteredItems.length === 0 ? (
        <div className="tv-menu-page__no-results">
          <p>No dishes match &ldquo;{query}&rdquo;{activeCategory !== ALL_CATEGORY ? ` in ${activeCategory}` : ''}.</p>
          <button type="button" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : groupedByCategory ? (
        groupedByCategory.map(([category, categoryItems]) => (
          <section key={category} className="tv-menu-page__section" aria-labelledby={`menu-heading-${category}`}>
            <h2 id={`menu-heading-${category}`} className="tv-menu-page__heading">{category}</h2>
            <div className="tv-menu-page__grid">
              {categoryItems.map((item) => (
                <MenuItemCard key={item._id} item={item} onOpenDetails={() => setOpenItemId(item._id)} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="tv-menu-page__grid tv-menu-page__grid--flat">
          {filteredItems.map((item) => (
            <MenuItemCard key={item._id} item={item} onOpenDetails={() => setOpenItemId(item._id)} />
          ))}
        </div>
      )}

      {openItem && <MenuItemModal key={openItem._id} item={openItem} onClose={() => setOpenItemId(null)} />}
    </div>
  );
}
