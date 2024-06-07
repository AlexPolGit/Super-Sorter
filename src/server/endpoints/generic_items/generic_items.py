from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_GENERIC_ITEMS as genericItemGame, AuthenticatedResource
from endpoints.generic_items.models import GENERIC_ITEM, GENERIC_ITEM_CREATE, ADD_GENERIC_ITEMS, GENERIC_ITEM_QUERY, GENERIC_ITEMS

generic = Namespace("Generic Items", description = "Endpoints for getting generic item data.")

CommonErrorModel = generic.add_model("Error", COMMON_ERROR_MODEL)

generic.add_model("GenericItem", GENERIC_ITEM)
generic.add_model("GenericItemCreate", GENERIC_ITEM_CREATE)
AddGenericItemsModel = generic.add_model("AddGenericItems", ADD_GENERIC_ITEMS) 
GenericItemQueryModel = generic.add_model("GenericItemQuery", GENERIC_ITEM_QUERY) 
GenericItemsModel = generic.add_model("GenericItems", GENERIC_ITEMS)

@generic.route("/items")
@generic.response(500, "InternalError", CommonErrorModel)
class Items(AuthenticatedResource):
    @generic.expect(AddGenericItemsModel)
    @generic.response(200, "GenericItems", GenericItemsModel)
    @generic.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return genericItemGame.addItems(requestData["items"])
    
@generic.route("/items/list")
@generic.response(500, "InternalError", CommonErrorModel)
class GetItems(AuthenticatedResource):
    @generic.expect(GenericItemQueryModel)
    @generic.response(200, "GenericItems", GenericItemsModel)
    @generic.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return genericItemGame.getItems(requestData["ids"])
