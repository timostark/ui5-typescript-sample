/****** ODATA Model *******/

import { GenericState, updateModel } from "../json/GenericStateModel";

export interface ODataResult {
    __metadata?: {
        id: string,
        type: string,
        uri: string
    }
}

export interface ODataEntityResults<B> {
    results: B[];
}

export interface Customer extends ODataResult {
    CustomerID?: string;
    CompanyName?: string;
    ContactName?: string;
    ContactTitle?: string;
    Address?: string;
    City?: number;
    Region?: number;
    PostalCode?: number;
    Country?: number;
    Phone?: number;
    Fax?: number;
    
    Orders?: ODataEntityResults<Orders>;
}
export interface Orders extends ODataResult {
    OrderID: number;
    CustomerID: string;
    EmployId: number;
    OrderDate: Date;
    RequiredDate: Date;
    ShipName: string;

    Order_Details?: ODataEntityResults<OrderDetails>;
}

export interface OrderDetails extends ODataResult {
    OrderID: number;
    ProductID: number;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
}

export class CustomerState extends GenericState {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: number;
    Region: number;
    PostalCode: number;
    Country: number;
    Phone: number;
    Fax: number;
    
    Orders : OrderState[];

    constructor(oDataState: Customer) {
        super();
        
        this.CustomerID = oDataState.CustomerID;
        this.CompanyName = oDataState.CompanyName;
        this.ContactName = oDataState.ContactName;
        this.ContactTitle = oDataState.ContactTitle;
        this.Address = oDataState.Address;
        this.City = oDataState.City;
        this.Region = oDataState.Region;
        this.PostalCode = oDataState.PostalCode;
        this.Country = oDataState.Country;
        this.Phone = oDataState.Phone;
        this.Fax = oDataState.Fax;

        this.Orders = oDataState.Orders?.results?.map((e) => new OrderState(e)) ?? [];
    }
    
    get amountOfOrders() : number {
        return this.Orders.length;
    }

    @updateModel
    public deleteAllOrders() {
        this.Orders = [];
    }
}

export class OrderState {
    OrderID: number;
    CustomerID: string;
    EmployId: number;
    OrderDate: Date;
    RequiredDate: Date;
    ShipName: string;

    constructor(oDataState: Orders) {
        this.CustomerID = oDataState.CustomerID;
        this.OrderID = oDataState.OrderID;
        this.EmployId = oDataState.EmployId;
        this.OrderDate = oDataState.OrderDate;
        this.RequiredDate = oDataState.RequiredDate;
        this.ShipName = oDataState.ShipName;
    }
}