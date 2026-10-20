import os
import requests
import time

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
            print(f"❌ Not Found ({response.status_code}): {os.path.basename(filepath)}")
    except Exception as e:
        print(f"⚠️ Error: {e}")

# Complete artifact map (5-star + 4-star + 3-star)
artifact_map = {
    # 5-Star Endgame Sets
    "GladiatorsFinale": "15001", "WanderersTroupe": "15002", "NoblesseOblige": "15003", "BloodstainedChivalry": "15004",
    "MaidenBeloved": "15005", "ViridescentVenerer": "15006", "ArchaicPetra": "15007", "RetracingBolide": "15008",
    "Thundersoother": "15009", "ThunderingFury": "15010", "Lavawalker": "15011", "CrimsonWitchOfFlames": "15012",
    "BlizzardStrayer": "15013", "HeartOfDepth": "15014", "TenacityOfTheMillelith": "15015", "PaleFlame": "15016",
    "ShimenawasReminiscence": "15017", "EmblemOfSeveredFate": "15018", "HuskOfOpulentDreams": "15019", "OceanHuedClam": "15020",
    "VermillionHereafter": "15021", "EchoesOfAnOffering": "15022", "DeepwoodMemories": "15023", "GildedDreams": "15024",
    "DesertPavilionChronicle": "15025", "FlowerOfParadiseLost": "15026", "NymphsDream": "15027", "VourukashasGlow": "15028",
    "MarechausseeHunter": "15029", "GoldenTroupe": "15030", "SongOfDaysPast": "15031", "NighttimeWhispersInTheEchoingWoods": "15032",
    "FragmentOfHarmonicWhimsy": "15033", "UnfinishedReverie": "15034", "ScrollOfTheHeroOfCinderCity": "15035", "ObsidianCodex": "15036",
    "LongNightsOath": "15037", "SilkenMoonsSerenade": "15038", "AubadeOfMorningstarAndMoon": "15039", "ADayCarvedFromRisingWinds": "15040",
    "NightOfTheSkysUnveiling": "15041", "CelestialGift": "15042", "HeartOfTheFurnace": "15043",
    "DisenchantmentInDeepShadows": "15046", "ScarletProof": "15047",

    # 4-Star & 3-Star Early/Mid Sets (IDs based on community databases)
    "ResolutionOfSojourner": "10001", "BraveHeart": "10002", "DefendersWill": "10003", "TinyMiracle": "10004",
    "Berserker": "10005", "MartialArtist": "10006", "Instructor": "10007", "Gambler": "10008",
    "TheExile": "10009", "Adventurer": "10010", "LuckyDog": "10011", "Scholar": "10012",
    "TravelingDoctor": "10013", "PrayersForIllumination": "15033", "PrayersForDestiny": "15034",
    "PrayersForWisdom": "15035", "PrayersToSpringtime": "15036"
}

print("--- DOWNLOADING ARTIFACT ICONS (ALL 63 SETS) ---")
for set_name, item_id in artifact_map.items():
    url = f"https://gi.yatta.moe/assets/UI/reliquary/UI_RelicIcon_{item_id}_4.png"
    filepath = f"public/artifacts/{set_name}.png"
    
    if not os.path.exists(filepath):
        download_file(url, filepath)
        time.sleep(0.2)

print("\nAll done!")