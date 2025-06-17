# Midsommarplanerare

En interaktiv webbapplikation för att planera ett oförglömligt midsommarfirande med mat, inköpslista och festlig design.

## Funktioner

- **Inloggning:** Enkel inloggning med användarnamn och lösenord (hårdkodat).
- **Flera färgteman:** Fyra distinkta teman (Swedish Summer, Meadow, Archipelago, Wild) med smidig övergång och tema-knapp 🎨.
- **Konfetti-effekt:** Varje gång temat byts firas det med färgglad konfetti på skärmen.
- **Interaktiv menyplan:** Dag-för-dag-meny med möjlighet att lägga till och kommentera måltider.
- **Dynamisk inköpslista:** Kategoriserad, interaktiv lista med progressbar och filter för att dölja avklarade.
- **Responsiv design:** Fungerar på både desktop och mobil.
- **Databas:** All data (meny, kommentarer, inköpslista) lagras i Supabase.

## Teknisk stack

- HTML5
- CSS3 (med Tailwind CSS och egna CSS-variabler för teman)
- JavaScript (Vanilla)
- Supabase (databas)
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) för konfetti-effekt

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

-- Menu items table
create table menu_items (
  id uuid default uuid_generate_v4() primary key,
  day text not null,
  day_title text not null,
  meal_order int not null,
  title text not null,
  description text,
  items jsonb,
  is_vegetarian boolean default false,
  is_dairy_free boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
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
```js
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```

4. Starta en lokal server för utveckling (t.ex. med Python):
```bash
python -m http.server 8000
```

5. Öppna `http://localhost:8000` i din webbläsare

## Inloggning

För att använda appen krävs inloggning:
- **Användarnamn:** `midsommar`
- **Lösenord:** `ela2025!`

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