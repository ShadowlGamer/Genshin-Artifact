import os
import requests
import json
import re
import time

# 1. SETUP FOLDERS
os.makedirs('public/chars', exist_ok=True)
os.makedirs('public/artifacts', exist_ok=True)

def download_file(url, filepath):
    try:
        response = requests.get(url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"✅ Downloaded: {os.path.basename(filepath)}")
        else:
            print(f"❌ Not Found ({response.status_code}): {url}")
    except Exception as e:
        print(f"⚠️ Error downloading {url}: {e}")

# 2. CHARACTERS (Fixing the last few missing ones)
print("--- DOWNLOADING CHARACTERS ---")
char_map = {
    "Hu Tao": "Hutao", "Raiden Shogun": "Shougun", "Raiden": "Shougun",
    "Kamisato Ayaka": "Ayaka", "Kamisato Ayato": "Ayato", "Kaedehara Kazuha": "Kazuha",
    "Sangonomiya Kokomi": "Kokomi", "Arataki Itto": "Itto", "Itto": "Itto",
    "Kujou Sara": "Sara", "Kuki Shinobu": "Shinobu", "Yae Miko": "Yae", "Yun Jin": "Yunjin",
    "Shikanoin Heizou": "Heizo", "Heizou": "Heizo", "Baizhu": "Baizhuer",
    "Alhaitham": "Alhatham", "Amber": "Ambor", "Jean": "Qin", "Kirara": "Momoka",
    "Lynette": "Linette", "Lyney": "Liney", "Noelle": "Noel", "Ororon": "Olorun",
    "Thoma": "Tohma", "Xianyun": "Liuyun", "Yanfei": "Feiyan",
    "Lan Yan": "LanYan", "LanYan": "LanYan",
    "Traveler (Anemo)": "PlayerBoy", "Traveler (Cryo)": "PlayerBoy", "Traveler (Dendro)": "PlayerBoy", 
    "Traveler (Electro)": "PlayerBoy", "Traveler (Geo)": "PlayerBoy", "Traveler (Hydro)": "PlayerBoy", "Traveler (Pyro)": "PlayerBoy", 
    "Aether": "PlayerBoy", "Lumine": "PlayerGirl"
}

try:
    with open('src/builds.json', 'r') as f:
        all_chars = list(json.load(f).keys())
except FileNotFoundError:
    with open('builds.json', 'r') as f:
        all_chars = list(json.load(f).keys())

for char in all_chars:
    safe_name = re.sub(r'[^a-zA-Z0-9]', '', char) 
    enka_name = char_map.get(char, safe_name)
    url = f"https://enka.network/ui/UI_AvatarIcon_{enka_name}.png"
    filepath = f"public/chars/{safe_name}.png"
    
    if not os.path.exists(filepath):
        download_file(url, filepath)
        time.sleep(0.2) # Be polite to the server

# 3. ARTIFACTS (Using HoYoLAB Wiki CDN for the missing sets)
print("\n--- DOWNLOADING ARTIFACTS ---")

# Use standard Enka IDs for most, and HoYoLAB links for the old missing ones
artifact_map = {
    "GladiatorsFinale": "https://enka.network/ui/UI_RelicIcon_15001_4.png",
    "WanderersTroupe": "https://enka.network/ui/UI_RelicIcon_15002_4.png",
    "NoblesseOblige": "https://enka.network/ui/UI_RelicIcon_15003_4.png",
    "BloodstainedChivalry": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Bloodstained%2520Chivalry/flower_of_life_icon.png",
    "MaidenBeloved": "https://enka.network/ui/UI_RelicIcon_15005_4.png",
    "ViridescentVenerer": "https://enka.network/ui/UI_RelicIcon_15006_4.png",
    "ArchaicPetra": "https://enka.network/ui/UI_RelicIcon_15007_4.png",
    "RetracingBolide": "https://enka.network/ui/UI_RelicIcon_15008_4.png",
    "Thundersoother": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Thundersoother/flower_of_life_icon.png",
    "ThunderingFury": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Thundering%2520Fury/flower_of_life_icon.png",
    "Lavawalker": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Lavawalker/flower_of_life_icon.png",
    "CrimsonWitchOfFlames": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Crimson%2520Witch%2520of%2520Flames/flower_of_life_icon.png",
    "BlizzardStrayer": "https://wiki.hoyolab.com/_ipx/f_webp/https://bbs.hoyolab.com/hoyowiki/picture/reliquary/Blizzard%2520Strayer/flower_of_life_icon.png",
    "HeartOfDepth": "https://enka.network/ui/UI_RelicIcon_15014_4.png",
    "TenacityOfTheMillelith": "https://enka.network/ui/UI_RelicIcon_15015_4.png",
    "PaleFlame": "https://enka.network/ui/UI_RelicIcon_15016_4.png",
    "ShimenawasReminiscence": "https://enka.network/ui/UI_RelicIcon_15017_4.png",
    "EmblemOfSeveredFate": "https://enka.network/ui/UI_RelicIcon_15018_4.png",
    "HuskOfOpulentDreams": "https://enka.network/ui/UI_RelicIcon_15019_4.png",
    "OceanHuedClam": "https://enka.network/ui/UI_RelicIcon_15020_4.png",
    "VermillionHereafter": "https://enka.network/ui/UI_RelicIcon_15021_4.png",
    "EchoesOfAnOffering": "https://enka.network/ui/UI_RelicIcon_15022_4.png",
    "DeepwoodMemories": "https://enka.network/ui/UI_RelicIcon_15023_4.png",
    "GildedDreams": "https://enka.network/ui/UI_RelicIcon_15024_4.png",
    "DesertPavilionChronicle": "https://enka.network/ui/UI_RelicIcon_15025_4.png",
    "FlowerOfParadiseLost": "https://enka.network/ui/UI_RelicIcon_15026_4.png",
    "NymphsDream": "https://enka.network/ui/UI_RelicIcon_15027_4.png",
    "VourukashasGlow": "https://enka.network/ui/UI_RelicIcon_15028_4.png",
    "MarechausseeHunter": "https://enka.network/ui/UI_RelicIcon_15029_4.png",
    "GoldenTroupe": "https://enka.network/ui/UI_RelicIcon_15030_4.png",
    "SongOfDaysPast": "https://enka.network/ui/UI_RelicIcon_15031_4.png",
    "NighttimeWhispersInTheEchoingWoods": "https://enka.network/ui/UI_RelicIcon_15032_4.png",
    "FragmentOfHarmonicWhimsy": "https://enka.network/ui/UI_RelicIcon_15033_4.png",
    "UnfinishedReverie": "https://enka.network/ui/UI_RelicIcon_15034_4.png",
    "ScrollOfTheHeroOfCinderCity": "https://enka.network/ui/UI_RelicIcon_15035_4.png",
    "ObsidianCodex": "https://enka.network/ui/UI_RelicIcon_15036_4.png",
    "LongNightsOath": "https://enka.network/ui/UI_RelicIcon_15037_4.png",
    "SilkenMoonsSerenade": "https://enka.network/ui/UI_RelicIcon_15038_4.png",
    "AubadeOfMorningstarAndMoon": "https://enka.network/ui/UI_RelicIcon_15039_4.png",
    "ADayCarvedFromRisingWinds": "https://enka.network/ui/UI_RelicIcon_15040_4.png"
}

for set_name, url in artifact_map.items():
    filepath = f"public/artifacts/{set_name}.png"
    if not os.path.exists(filepath):
        download_file(url, filepath)
        time.sleep(0.2)

print("\nAll done! Images are saved in the 'public' folder.")