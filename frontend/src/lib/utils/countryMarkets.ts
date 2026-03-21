import type { Market } from "@/lib/stellar/types";

export interface FootballCountry {
  code: string;
  name: string;
  aliases: string[];
  coordinates: [number, number]; // [lng, lat]
}

export interface CountryMatch {
  countryCode: string;
  countryName: string;
  coordinates: [number, number];
  marketIds: Set<number>;
  marketCount: number;
}

/**
 * ~50 major football nations across all confederations.
 * aliases include demonyms, league names, cities, and nicknames.
 */
const FOOTBALL_COUNTRIES: FootballCountry[] = [
  // ── CONMEBOL ──
  { code: "AR", name: "Argentina", aliases: ["Argentine", "Buenos Aires", "Liga Profesional", "Boca Juniors", "River Plate", "Messi"], coordinates: [-64.0, -34.0] },
  { code: "BR", name: "Brazil", aliases: ["Brazilian", "Brasileirão", "São Paulo", "Rio de Janeiro", "Neymar", "Seleção"], coordinates: [-51.9, -14.2] },
  { code: "UY", name: "Uruguay", aliases: ["Uruguayan", "Montevideo", "La Celeste"], coordinates: [-56.0, -33.0] },
  { code: "CO", name: "Colombia", aliases: ["Colombian", "Bogotá", "Liga BetPlay"], coordinates: [-74.0, 4.6] },
  { code: "CL", name: "Chile", aliases: ["Chilean", "Santiago", "La Roja"], coordinates: [-70.6, -33.4] },
  { code: "EC", name: "Ecuador", aliases: ["Ecuadorian", "Quito", "Liga Pro"], coordinates: [-78.5, -1.8] },
  { code: "PY", name: "Paraguay", aliases: ["Paraguayan", "Asunción"], coordinates: [-57.6, -25.3] },
  { code: "PE", name: "Peru", aliases: ["Peruvian", "Lima", "Liga 1"], coordinates: [-77.0, -12.0] },
  { code: "VE", name: "Venezuela", aliases: ["Venezuelan", "Caracas"], coordinates: [-66.9, 10.5] },
  { code: "BO", name: "Bolivia", aliases: ["Bolivian", "La Paz"], coordinates: [-68.1, -16.5] },

  // ── UEFA ──
  { code: "GB", name: "England", aliases: ["English", "Premier League", "EPL", "London", "Manchester United", "Manchester City", "Liverpool", "Chelsea", "Arsenal", "Tottenham", "Three Lions"], coordinates: [-1.2, 52.2] },
  { code: "ES", name: "Spain", aliases: ["Spanish", "La Liga", "Madrid", "Barcelona", "Real Madrid", "Atlético", "Sevilla", "La Roja"], coordinates: [-3.7, 40.4] },
  { code: "DE", name: "Germany", aliases: ["German", "Bundesliga", "Bayern Munich", "Bayern München", "Dortmund", "Berlin", "Die Mannschaft"], coordinates: [10.5, 51.2] },
  { code: "FR", name: "France", aliases: ["French", "Ligue 1", "Paris", "PSG", "Paris Saint-Germain", "Marseille", "Les Bleus", "Mbappé"], coordinates: [2.2, 46.6] },
  { code: "IT", name: "Italy", aliases: ["Italian", "Serie A", "Juventus", "Milan", "Inter Milan", "Roma", "Napoli", "Azzurri"], coordinates: [12.6, 41.9] },
  { code: "PT", name: "Portugal", aliases: ["Portuguese", "Primeira Liga", "Lisbon", "Porto", "Benfica", "Sporting", "Ronaldo"], coordinates: [-9.1, 38.7] },
  { code: "NL", name: "Netherlands", aliases: ["Dutch", "Eredivisie", "Amsterdam", "Ajax", "PSV", "Oranje"], coordinates: [5.3, 52.1] },
  { code: "BE", name: "Belgium", aliases: ["Belgian", "Pro League", "Brussels", "Red Devils"], coordinates: [4.4, 50.8] },
  { code: "HR", name: "Croatia", aliases: ["Croatian", "Zagreb", "Dinamo Zagreb", "Vatreni"], coordinates: [15.2, 45.1] },
  { code: "RS", name: "Serbia", aliases: ["Serbian", "Belgrade", "Red Star Belgrade"], coordinates: [21.0, 44.0] },
  { code: "CH", name: "Switzerland", aliases: ["Swiss", "Super League", "Zürich", "Basel"], coordinates: [8.2, 46.8] },
  { code: "AT", name: "Austria", aliases: ["Austrian", "Bundesliga Austria", "Vienna", "Salzburg"], coordinates: [14.6, 47.5] },
  { code: "PL", name: "Poland", aliases: ["Polish", "Ekstraklasa", "Warsaw", "Lewandowski"], coordinates: [19.1, 51.9] },
  { code: "TR", name: "Turkey", aliases: ["Turkish", "Süper Lig", "Istanbul", "Galatasaray", "Fenerbahçe", "Beşiktaş"], coordinates: [32.9, 39.9] },
  { code: "UA", name: "Ukraine", aliases: ["Ukrainian", "Kyiv", "Shakhtar Donetsk", "Dynamo Kyiv"], coordinates: [31.2, 48.4] },
  { code: "DK", name: "Denmark", aliases: ["Danish", "Superliga", "Copenhagen"], coordinates: [9.5, 56.3] },
  { code: "SE", name: "Sweden", aliases: ["Swedish", "Allsvenskan", "Stockholm"], coordinates: [18.6, 60.1] },
  { code: "NO", name: "Norway", aliases: ["Norwegian", "Eliteserien", "Oslo", "Haaland"], coordinates: [8.5, 60.5] },
  { code: "GR", name: "Greece", aliases: ["Greek", "Super League Greece", "Athens", "Olympiacos"], coordinates: [21.8, 39.1] },
  { code: "CZ", name: "Czech Republic", aliases: ["Czech", "Česká", "Prague", "Sparta Prague"], coordinates: [15.5, 49.8] },
  { code: "RO", name: "Romania", aliases: ["Romanian", "Liga I", "Bucharest"], coordinates: [25.0, 46.0] },
  { code: "SC", name: "Scotland", aliases: ["Scottish", "Scottish Premiership", "Celtic", "Rangers", "Glasgow", "Edinburgh"], coordinates: [-4.2, 56.5] },

  // ── CONCACAF ──
  { code: "MX", name: "Mexico", aliases: ["Mexican", "Liga MX", "Mexico City", "Club América", "Chivas", "El Tri"], coordinates: [-102.6, 23.6] },
  { code: "US", name: "United States", aliases: ["American", "MLS", "Major League Soccer", "USMNT"], coordinates: [-95.7, 37.1] },
  { code: "CA", name: "Canada", aliases: ["Canadian", "Canadian Premier League", "Toronto FC", "Vancouver"], coordinates: [-106.3, 56.1] },
  { code: "CR", name: "Costa Rica", aliases: ["Costa Rican", "San José"], coordinates: [-84.0, 10.0] },

  // ── AFC ──
  { code: "JP", name: "Japan", aliases: ["Japanese", "J-League", "J1 League", "Tokyo", "Samurai Blue"], coordinates: [138.3, 36.2] },
  { code: "KR", name: "South Korea", aliases: ["Korean", "K League", "Seoul", "Taegeuk Warriors"], coordinates: [127.8, 35.9] },
  { code: "SA", name: "Saudi Arabia", aliases: ["Saudi", "Saudi Pro League", "Riyadh", "Al Hilal", "Al Nassr", "Al-Hilal", "Al-Nassr"], coordinates: [45.1, 23.9] },
  { code: "AU", name: "Australia", aliases: ["Australian", "A-League", "Sydney", "Socceroos"], coordinates: [133.8, -25.3] },
  { code: "QA", name: "Qatar", aliases: ["Qatari", "Qatar Stars League", "Doha"], coordinates: [51.2, 25.3] },
  { code: "AE", name: "UAE", aliases: ["Emirati", "Arabian Gulf League", "Dubai", "Abu Dhabi"], coordinates: [54.0, 23.4] },

  // ── CAF ──
  { code: "NG", name: "Nigeria", aliases: ["Nigerian", "NPFL", "Lagos", "Super Eagles"], coordinates: [8.7, 9.1] },
  { code: "EG", name: "Egypt", aliases: ["Egyptian", "Egyptian Premier League", "Cairo", "Al Ahly", "Zamalek", "Salah", "Pharaohs"], coordinates: [30.8, 26.8] },
  { code: "MA", name: "Morocco", aliases: ["Moroccan", "Botola Pro", "Casablanca", "Atlas Lions"], coordinates: [-7.1, 31.8] },
  { code: "SN", name: "Senegal", aliases: ["Senegalese", "Dakar", "Teranga Lions"], coordinates: [-14.5, 14.5] },
  { code: "GH", name: "Ghana", aliases: ["Ghanaian", "Ghana Premier League", "Accra", "Black Stars"], coordinates: [-1.0, 7.9] },
  { code: "CM", name: "Cameroon", aliases: ["Cameroonian", "Yaoundé", "Indomitable Lions"], coordinates: [12.4, 7.4] },
  { code: "DZ", name: "Algeria", aliases: ["Algerian", "Ligue Professionnelle", "Algiers", "Desert Foxes"], coordinates: [1.7, 28.0] },
  { code: "TN", name: "Tunisia", aliases: ["Tunisian", "Ligue Professionnelle 1", "Tunis", "Eagles of Carthage"], coordinates: [9.5, 33.9] },
  { code: "CI", name: "Ivory Coast", aliases: ["Ivorian", "Côte d'Ivoire", "Abidjan", "Elephants"], coordinates: [-5.5, 7.5] },
  { code: "ZA", name: "South Africa", aliases: ["South African", "PSL", "Johannesburg", "Bafana Bafana"], coordinates: [22.9, -30.6] },
];

// Sort aliases longest-first so multi-word names match before substrings
const SORTED_COUNTRIES = FOOTBALL_COUNTRIES.map((c) => ({
  ...c,
  aliases: [...c.aliases].sort((a, b) => b.length - a.length),
}));

/**
 * Build a word-boundary regex pattern for a term.
 * Escapes regex special chars.
 */
function termRegex(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}

/**
 * Detect which countries are mentioned across all markets.
 * Returns a Map keyed by country code.
 */
export function detectCountries(
  markets: Market[],
): Map<string, CountryMatch> {
  const result = new Map<string, CountryMatch>();

  for (const market of markets) {
    const text = market.question;

    for (const country of SORTED_COUNTRIES) {
      // Check country name first
      let matched = termRegex(country.name).test(text);

      // Check aliases if name didn't match
      if (!matched) {
        for (const alias of country.aliases) {
          if (termRegex(alias).test(text)) {
            matched = true;
            break;
          }
        }
      }

      if (matched) {
        let entry = result.get(country.code);
        if (!entry) {
          entry = {
            countryCode: country.code,
            countryName: country.name,
            coordinates: country.coordinates,
            marketIds: new Set(),
            marketCount: 0,
          };
          result.set(country.code, entry);
        }
        entry.marketIds.add(market.id);
        entry.marketCount = entry.marketIds.size;
      }
    }
  }

  return result;
}
