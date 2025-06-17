# Midsommar Planerareare

En interaktiv webbapplikation för att planera midsommarfirande med mat och inköpslista.

## Funktioner

- Interaktiv menyplan med kommentarsmöjlighet för varje måltid
- Dynamisk inköpslista med kategorisering
- Möjlighet att lägga till önskemål
- Progress tracking för inköpslistan
- Responsiv design för både desktop och mobil

## Teknisk Stack

- HTML5
- CSS3 (med Tailwind CSS)
- JavaScript (Vanilla)
- Supabase (för databas)

## Setup

1. Skapa ett Supabase-projekt på [supabase.com](https://supabase.com)
2. Skapa följande tabeller i Supabase:

```sql
-- Shopping items table
create table shopping_items (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  category text not null,
  checked boolean default false,
  is_wishlist boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Menu comments table
create table menu_comments (
  id uuid default uuid_generate_v4() primary key,
  section_id text not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

3. Uppdatera `supabase.js` med dina Supabase credentials:
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```

4. Starta en lokal server för utveckling (t.ex. med Python):
```bash
python -m http.server 8000
```

5. Öppna `http://localhost:8000` i din webbläsare

## Deployment

För att deploya till GitHub Pages:

1. Skapa ett nytt repository på GitHub
2. Pusha koden till repositoryt
3. Gå till repository settings
4. Under "GitHub Pages", välj main branch som source
5. Din app kommer nu vara tillgänglig på `https://[username].github.io/[repository-name]`

## Säkerhet

- Använd endast Supabase's anon key för klient-sidan
- Implementera Row Level Security (RLS) i Supabase för att skydda data
- Begränsa CORS-inställningar i Supabase till din domän

## Bidra

1. Forka repositoryt
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add some amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request 