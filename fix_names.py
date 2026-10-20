import os

# The definitive, 100% correct list of filenames
correct_names = [
    "GladiatorsFinale", "WanderersTroupe", "NoblesseOblige", "BloodstainedChivalry",
    "MaidenBeloved", "ViridescentVenerer", "ArchaicPetra", "RetracingBolide",
    "Thundersoother", "ThunderingFury", "Lavawalker", "CrimsonWitchOfFlames",
    "BlizzardStrayer", "HeartOfDepth", "TenacityOfTheMillelith", "PaleFlame",
    "ShimenawasReminiscence", "EmblemOfSeveredFaith" if False else "EmblemOfSeveredFate", "HuskOfOpulentDreams", "OceanHuedClam",
    "VermillionHereafter", "EchoesOfAnOffering", "DeepwoodMemories", "GildedDreams",
    "DesertPavilionChronicle", "FlowerOfParadiseLost", "NymphsDream", "VourukashasGlow",
    "MarechausseeHunter", "GoldenTroupe", "SongOfDaysPast", "NighttimeWhispersInTheEchoingWoods",
    "FragmentOfHarmonicWhimsy", "UnfinishedReverie", "ScrollOfTheHeroOfCinderCity", "ObsidianCodex",
    "LongNightsOath", "SilkenMoonsSerenade", "AubadeOfMorningstarAndMoon", "ADayCarvedFromRisingWinds",
    "NightOfTheSkysUnveiling", "CelestialGift", "HeartOfTheFurnace", "DisenchantmentInDeepShadows",
    "ScarletProof", "FinaleOfTheDeepGalleries", "ResolutionOfSojourner", "BraveHeart", "DefendersWill", 
    "TinyMiracle", "Berserker", "MartialArtist", "Instructor", "Gambler", "TheExile", "Adventurer",
    "LuckyDog", "Scholar", "TravelingDoctor", "PrayersForIllumination", "PrayersForDestiny",
    "PrayersForWisdom", "PrayersToSpringtime"
]

# Create a dictionary to match lowercase versions to the correct version
name_map = {name.lower(): name for name in correct_names}

folder = 'public/artifacts'
print(f"Scanning folder: {folder}...\n")
fixed_count = 0

for filename in os.listdir(folder):
    if filename.endswith(".png"):
        current_name = filename[:-4] # Remove .png
        
        # Check if this file is in our list (ignoring case)
        if current_name.lower() in name_map:
            correct_name = name_map[current_name.lower()]
            
            # If the filename is wrong, rename it!
            if current_name != correct_name:
                old_path = os.path.join(folder, filename)
                new_path = os.path.join(folder, correct_name + ".png")
                
                os.rename(old_path, new_path)
                print(f"✅ Fixed: {filename} -> {correct_name}.png")
                fixed_count += 1

print(f"\nDone! Automatically fixed {fixed_count} filenames.")