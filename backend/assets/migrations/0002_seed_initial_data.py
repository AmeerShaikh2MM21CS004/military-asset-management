# backend/assets/migrations/0002_seed_initial_data.py
from django.db import migrations

def seed_data(apps, schema_editor):
    Base = apps.get_model('assets', 'Base')
    EquipmentType = apps.get_model('assets', 'EquipmentType')

    for i in range(26):
        Base.objects.create(name=f"Base {chr(65 + i)}")

    equipment = ["Rifle", "Radio", "Ammo", "Tent", "Uniform"]
    for item in equipment:
        EquipmentType.objects.create(name=item)

class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data),
    ]
