from rest_framework import serializers
from .models import Base, EquipmentType, Asset, Transfer, Assignment, Expenditure, Purchase

class BaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Base
        fields = '__all__'

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = '__all__'

class AssetSerializer(serializers.ModelSerializer):
    base_name = serializers.CharField(source='base.name', read_only=True)
    equipment_type_name = serializers.CharField(source='equipment_type.name', read_only=True)

    class Meta:
        model = Asset
        fields = '__all__'

class TransferSerializer(serializers.ModelSerializer):
    from_base = serializers.PrimaryKeyRelatedField(queryset=Base.objects.all())
    to_base = serializers.PrimaryKeyRelatedField(queryset=Base.objects.all())
    asset = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all())

    class Meta:
        model = Transfer
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class ExpenditureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenditure
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'
