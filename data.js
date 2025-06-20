// data.js

export const commodityData = {
  maize: {
    emoji: '🌽',
    traders: [
      { id: 't001', name: 'John Mwangi', market: 'Kisii Town', units: '{"90kg bag":90,"50kg bag":50,"1 Gorogoro(2kg)":2,"10kg bag":10}', price: '{"90kg bag":4500,"50kg bag":2600 ,"1 Gorogoro(2kg)":130, "10kg bag":600}' },
      { id: 't002', name: 'Maize Mart', market: 'Eldoret', units: '{"90kg bag":90,"50kg bag":50}', price: '{"90kg bag":4200,"50kg bag":2400}' },
      { id: 't003', name: 'Maize Traders', market: 'Kisumu', units: '{"90kg bag":90,"50kg bag":50}', price: '{"90kg bag":4300,"50kg bag":2500}' }
    ]
  },
  sugar: {
    emoji: '🧂',
    traders: [
      { id: 't004', name: 'Mama Ciku', market: 'Nyamira', units: '{"crate":15,"gunia":25}', price: '{"crate":1000,"gunia":1500}' },
      { id: 't005', name: 'Sugar Mart', market: 'Nairobi', units: '{"50kg bag":50}', price: '{"50kg bag":2800}' },
      { id: 't006', name: 'Sugar Hub', market: 'Mombasa', units: '{"50kg bag":50}', price: '{"50kg bag":2900}' }
    ]
  },
  beans: {
    emoji: '🫘',
    traders: [
      { id: 't007', name: 'Achieng', market: 'Kisumu', units: '{"50kg bag":50}', price: '{"50kg bag":4500}' },
      { id: 't008', name: 'Beans Express', market: 'Nairobi', units: '{"90kg bag":90}', price: '{"90kg bag":8000}' },
      { id: 't009', name: 'Beans Depot', market: 'Eldoret', units: '{"50kg bag":50}', price: '{"50kg bag":4600}' }
    ]
  },
  wheat: {
    emoji: '🌾',
    traders: [
      { id: 't010', name: "Wheat Co", market: "Narok", units: '{"90kg bag":90}', price: '{"90kg bag":3500}' },
      { id: 't011', name: "Golden Grain", market: "Nakuru", units: '{"90kg bag":90}', price: '{"90kg bag":6500}' }
    ]
  },
  rice: {
    emoji: '🍚',
    traders: [
      { id: 't012', name: "Rice King", market: "Mwea", units: '{"50kg bag":50}', price: '{"50kg bag":3200}' },
      { id: 't013', name: "Pishori Deals", market: "Embu", units: '{"50kg bag":50}', price: '{"50kg bag":6100}' }
    ]
  },
  potatoes: {
    emoji: '🥔',
    traders: [
      { id: 't014', name: "Potato City", market: "Nyandarua", units: '{"sack":18}', price: '{"sack":900}' },
      { id: 't015', name: "Spud Valley", market: "Bomet", units: '{"sack":18}', price: '{"sack":1600}' }
    ]
  }
};

export const priceOptions = {
  "maize": ["Below 4000", "4000-5000", "5000+"],
  "sugar": ["Below 2500", "2500-3000", "3000+"],
  "beans": ["Below 4000", "4000-5000", "5000+"],
  "wheat": ["Below 4000", "4000-7000", "7000+"],
  "rice": ["Below 4000", "4000-6000", "6000+"],
  "potatoes": ["Below 1000", "1000-2000", "2000+"]
};

export const kenyanCountiesAndTowns = {
  "Mombasa County": ["Mombasa", "Likoni", "Nyali", "Changamwe", "Kisauni", "Tudor", "Bamburi", "Port Reitz", "Ganjoni", "Shanzu"],
  "Kwale County": ["Kwale", "Ukunda", "Lunga Lunga", "Kinango", "Msambweni", "Mwaluphamba", "Tiwi", "Kikoneni", "Pungu", "Diani"],
  "Kilifi County": ["Kilifi", "Malindi", "Kaloleni", "Rabai", "Ganze", "Mtwapa", "Mariakani", "Chonyi", "Sokoke", "Mida"],
  "Tana River County": ["Hola", "Garsen", "Bura", "Madogo", "Bangale", "Kipini", "Kone", "Wenje", "Idho", "Chewani"],
  "Lamu County": ["Lamu", "Mokowe", "Hindi", "Faza", "Pate", "Kiunga", "Mkokoni", "Witu", "Matondoni", "Kizingitini"],
  "Taita Taveta County": ["Voi", "Wundanyi", "Mwatate", "Taveta", "Maungu", "Bura", "Ndii", "Chawia", "Marungu", "Maktau"],
  "Garissa County": ["Garissa", "Dadaab", "Liboi", "Hulugho", "Ijara", "Bura", "Modogashe", "Balambala", "Sangailu", "Fafi"],
  "Wajir County": ["Wajir", "Habaswein", "Griftu", "Bute", "Tarbaj", "Eldas", "Khorof Harar", "Kotulo", "Leheley", "Basir"],
  "Mandera County": ["Mandera", "Elwak", "Rhamu", "Takaba", "Banissa", "Lafey", "Arabia", "Ashabito", "Bulla Hawa", "Dandu"],
  "Marsabit County": ["Marsabit", "Moyale", "Sololo", "North Horr", "Laisamis", "Loiyangalani", "Maikona", "Illeret", "Chalbi", "Korolile"],
  "Isiolo County": ["Isiolo", "Garbatulla", "Modogashe", "Kinna", "Merti", "Oldonyiro", "Gotu", "Sericho", "Ngaremara", "Kombola"],
  "Meru County": ["Meru", "Maua", "Nkubu", "Chuka", "Mikinduri", "Laare", "Timau", "Kianjai", "Kaguru", "Mugunda"],
  "Tharaka Nithi County": ["Kathwana", "Chuka", "Chogoria", "Marimanti", "Magumoni", "Gatunga", "Kevote", "Nkondi", "Chiakariga", "Kamwimbi"],
  "Embu County": ["Embu", "Runyenjes", "Manyatta", "Siakago", "Kiritiri", "Mwea", "Kevote", "Gachoka", "Evurore", "Makima"],
  "Kitui County": ["Kitui", "Mwingi", "Mutomo", "Ikutha", "Kyuso", "Mumoni", "Tseikuru", "Endau", "Mutitu", "Kisasi"],
  "Machakos County": ["Machakos", "Kangundo", "Matuu", "Tala", "Masii", "Mavoko", "Athi River", "Syokimau", "Katani", "Kinanie"],
  "Makueni County": ["Wote", "Makindu", "Sultan Hamud", "Emali", "Kibwezi", "Mukaa", "Kaiti", "Kilome", "Mbooni", "Nzaui"],
  "Nyandarua County": ["Ol Kalou", "Kinangop", "Nyahururu", "Engineer", "Ndunyu Njeru", "Shamata", "Njabini", "Murungaru", "Rurii", "Kipipiri"],
  "Nyeri County": ["Nyeri", "Karatina", "Othaya", "Mukurweini", "Nyahururu", "Mukurweini", "Endarasha", "Kiganjo", "Naromoru", "Mweiga"],
  "Kirinyaga County": ["Kerugoya", "Kutus", "Wanguru", "Sagana", "Kagio", "Mwea", "Kianyaga", "Kimbimbi", "Kianjokoma", "Makutano"],
  "Murang'a County": ["Murang'a", "Maragua", "Kandara", "Kangema", "Gatanga", "Kigumo", "Kahuro", "Makuyu", "Kenol", "Saba Saba"],
  "Kiambu County": ["Kiambu", "Thika", "Limuru", "Ruwa", "Juja", "Githunguri", "Kabete", "Lari", "Gatundu", "Karuri"],
  "Turkana County": ["Lodwar", "Lokichogio", "Kakuma", "Lokitaung", "Lowdar", "Kibish", "Lokori", "Kalokol", "Turkwel", "Katilu"],
  "West Pokot County": ["Kapenguria", "Makutano", "Chepareria", "Kacheliba", "Alale", "Keringet", "Chepkumia", "Kipsingori", "Lelan", "Sigor"],
  "Samburu County": ["Maralal", "Baragoi", "Wamba", "Archer's Post", "Lodosoit", "Waso", "Suguta Marmar", "Ndoto", "Loosuk", "Kipkaren"],
  "Trans Nzoia County": ["Kitale", "Sibanga", "Kiminini", "Cherangany", "Endebess", "Kapsara", "Kwanza", "Bikeke", "Kapomboi", "Township"],
  "Uasin Gishu County": ["Eldoret", "Burnt Forest", "Turbo", "Iten", "Kesses", "Moiben", "Plateau", "Ainabkoi", "Kapseret", "Soy"],
  "Elgeyo Marakwet County": ["Iten", "Chepkorio", "Kapsowar", "Tambach", "Tot", "Arror", "Chebara", "Kaptagat", "Sangurur", "Kimwarer"],
  "Nandi County": ["Kapsabet", "Nandi Hills", "Mosoriot", "Kabiyet", "Chepterwai", "Kaptumo", "Lessos", "Kilibwoni", "Kapsabet Town", "Ndalat"],
  "Baringo County": ["Kabarnet", "Marigat", "Eldama Ravine", "Mogotio", "Kampi ya Samaki", "Kapedo", "Loruk", "Mochongoi", "Kabartonjo", "Chemolingot"],
  "Laikipia County": ["Nanyuki", "Nyandarua", "Rumuruti", "Doldol", "Kinamba", "Wiyumiririe", "Ol Jabet", "Nanyuki Town", "Pesi", "Sipili"],
  "Nakuru County": ["Nakuru", "Naivasha", "Molo", "Gilgil", "Rongai", "Njoro", "Elburgon", "Bahati", "Subukia", "Dundori"],
  "Narok County": ["Narok", "Kilgoris", "Ololulunga", "Suswa", "Sekenani", "Lolgorian", "Oleturot", "Enamashare", "Mulot", "Maasai Mara"],
  "Kajiado County": ["Kajiado", "Ngong", "Kitengela", "Isinya", "Oloitokitok", "Magadi", "Ilbisil", "Namanga", "Mashuru", "Ongata Rongai"],
  "Kericho County": ["Kericho", "Litein", "Londiani", "Kipkelion", "Ainamoi", "Sosiot", "Kapkatet", "Kabianga", "Kapsuser", "Chepseon"],
  "Bomet County": ["Bomet", "Sotik", "Chepalungu", "Mulot", "Ndanai", "Longisa", "Sigor", "Kapletundo", "Tenwek", "Bomet East"],
  "Kakamega County": ["Kakamega", "Mumias", "Malava", "Butere", "Lugari", "Matungu", "Navakholoi", "Shinyalu", "Khwisero", "Likuyani"],
  "Vihiga County": ["Mbale", "Luanda", "Chavakali", "Hamisi", "Majengo", "Emuhaya", "Gisambai", "Shiru", "Tiriki", "Jeptulu"],
  "Bungoma County": ["Bungoma", "Kimilili", "Webuye", "Chwele", "Sirisia", "Malakisi", "Naitiri", "Kanduyi", "Cheptais", "Bumula"],
  "Busia County": ["Busia", "Malaba", "Port Victoria", "Nambale", "Samia", "Funyula", "Butula", "Budalangi", "Matayos", "Bunyala"],
  "Siaya County": ["Siaya", "Bondo", "Ugunja", "Usenge", "Yala", "Gem", "Rarieda", "Uyoma", "Rageng'ni", "Madiany"],
  "Kisumu County": ["Kisumu", "Ahero", "Muhoroni", "Maseno", "Kondele", "Katito", "Kibos", "Koru", "Awasi", "Nyamasaria"],
  "Homa Bay County": ["Homa Bay", "Kendu Bay", "Mbita", "Oyugis", "Rachuonyo", "Ndhiwa", "Rangwe", "Kabondo", "Kodera", "Kosele"],
  "Migori County": ["Migori", "Rongo", "Awendo", "Macalder", "Muhuru Bay", "Sori", "Kehancha", "Masara", "Ranen", "Osingo"],
  "Kisii County": ["Kisii", "Ogembo", "Keroka", "Suneka", "Nyamache", "Marani", "Sameta", "Itumbe", "Kiamokama", "Nyacheki"],
  "Nyamira County": ["Nyamira", "Manga", "Rigoma", "Ekerenyo", "Nyaramba", "Kebirigo", "Ikonge", "Mwongori", "Gesima", "Magombo"],
  "Nairobi County": ["Nairobi", "Karen", "Runda", "Muthaiga", "Gigiri", "Lavington", "Kilimani", "Upper Hill", "Westlands", "Parklands"]
};

export const baseDeliveryRates = {
  local: 100, // For same-county deliveries (like boda zone)
  regional: 200, // For inter-county deliveries (like parcel service)
  longDistance: 300 // For very far deliveries
};

export const marketToCountyMap = {};
for (const county in kenyanCountiesAndTowns) {
    kenyanCountiesAndTowns[county].forEach(town => {
        marketToCountyMap[town.toLowerCase()] = county.toLowerCase();
    });
}

