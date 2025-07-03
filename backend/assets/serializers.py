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
    from_base_name = serializers.CharField(source='from_base.name', read_only=True)
    to_base_name = serializers.CharField(source='to_base.name', read_only=True)
    equipment_name = serializers.CharField(source='asset.name', read_only=True)
    equipment_type = serializers.CharField(source='asset.equipment_type.name', read_only=True)

    class Meta:
        model = Transfer
        fields = ['id', 'asset', 'from_base', 'to_base', 'quantity', 'date',
                  'from_base_name', 'to_base_name', 'equipment_name', 'equipment_type']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class ExpenditureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenditure
        fields = '__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    base_name = serializers.CharField(source='base.name', read_only=True)
    equipment_type_name = serializers.CharField(source='equipment_type.name', read_only=True)

    class Meta:
        model = Purchase
        fields = [
            'id',
            'base',                   
            'equipment_type',         
            'quantity',
            'date',
            'base_name',              
            'equipment_type_name'     
        ]
