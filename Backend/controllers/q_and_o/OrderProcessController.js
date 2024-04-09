const mockController = require("./mockController")
const Order = require('../../models/q_and_o/OrderExecutionDetail');
const MockOrderDetail = require("../../models/q_and_o/MockOrderDetail");

//temp
exports.addToMock = async (req, res) => {
    await mockController.addMockOrder(req, res);
};

exports.getSupplierList = async (req, res) => {
    try {
        const { fruit, category, quality } = req.body;
        // const filter = { fruit:fruit, category:category, quality:quality}
        // const supplierList = await Supplier.find(filter);
        const supplierList = [
            {name:"AA", quantity: 1000, price: 100},
            {name:"BB", quantity: 500, price: 100},
            {name:"CC", quantity: 5000, price: 100},
            {name:"DD", quantity: 785, price: 100},
            {name:"EE", quantity: 3689, price: 100},
        ]
        res.json(supplierList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error retrieving orders", error: err.message });
    }
};

exports.getAssignedOrderList = async (req, res) => {
    const filter = { orderStatus: "ASSIGNED" };
    await getOrderListByFilter(res, filter);
};

exports.getOngoingOrderList = async (req, res) => {
    const filter = { orderStatus: "IN_PROGRESS" };
    await getOrderListByFilter(res, filter);
};

exports.getCompletedOrderList = async (req, res) => {
    const filter = { orderStatus: "COMPLETED" };
    await getOrderListByFilter(res, filter);
};
exports.getAssignedOrderListByFilter = async (req, res) => {
    const filter = createFilterFromRequest(req);
    if (filter) {
        filter.orderStatus = "PENDING";
        await getOrderListByFilter(res, filter);
    } else {
        res.status(400).json({ message: 'Invalid filter type' });
    }
};

exports.getOngoingOrderListByFilter = async (req, res) => {
    const filter = createFilterFromRequest(req);
    if (filter) {
        filter.$or = [{ orderStatus: "ASSIGNED" }, { orderStatus: "IN_PROGRESS" }];
        await getOrderListByFilter(res, filter);
    } else {
        res.status(400).json({ message: 'Invalid filter type' });
    }
};

exports.getCompletedOrderListByFilter = async (req, res) => {
    const filter = createFilterFromRequest(req);
    if (filter) {
        filter.orderStatus = "COMPLETED";
        await getOrderListByFilter(res, filter);
    } else {
        res.status(400).json({ message: 'Invalid filter type' });
    }
};

const createFilterFromRequest = (req) => {
    const filterType = req.body.filterType;
    const filterValue = req.body.filterValue;
    let filter;
    switch (filterType) {
        case 'fruit':
            filter = { fruit: new RegExp(filterValue, 'i') };
            break;
        case 'category':
            filter = { category: new RegExp(filterValue, 'i') };
            break;
        case 'quality':
            filter = { quality: new RegExp(filterValue, 'i') };
            break;
        case 'customer':
            filter = { customer: new RegExp(filterValue, 'i') };
            break;
        case 'placedDate':
            filter = { placedDate: new Date(filterValue) };
            break;
        case 'dueDate':
            filter = { dueDate: new Date(filterValue) };
            break;
        default:
            return null;
    }
    return filter;
}

const getOrderListByFilter = async (res, filter) => {
    try {
        const pendingOrderList = await Order.find(filter);
        res.json(pendingOrderList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error retrieving quality records", error: err.message });
    }
}
