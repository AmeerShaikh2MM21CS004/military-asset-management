from django.db import models

class Base(models.Model):
    name = models.CharField(max_length=100)

class EquipmentType(models.Model):
    name = models.CharField(max_length=100)

class Asset(models.Model):
    name = models.CharField(max_length=100)
    equipment_type = models.ForeignKey(EquipmentType, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    base = models.ForeignKey(Base, on_delete=models.CASCADE)
    purchase_date = models.DateField()

class Transfer(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    from_base = models.ForeignKey(Base, related_name='transfers_out', on_delete=models.CASCADE)
    to_base = models.ForeignKey(Base, related_name='transfers_in', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    date = models.DateField()

class Assignment(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    personnel_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    date_assigned = models.DateField()

class Expenditure(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    date = models.DateField()
