export default {
    purchaseOrder: {
        title: "Purchase Order",
        path: {
            create: ["inventory/purchase/create"],
            lists: ["inventory/purchase/lists"],
            update: ["inventory/purchase/update"],
            archive: ["inventory/purchase/archive"]
        }
    },
    receiveOrder: {
        title: "Receive Order",
        path: {
            lists: ["inventory/purchase/receive/lists"],
            update: ["inventory/purchase/receive/update"]
        }
    },
    returnOrder: {
        title: "Return Order",
        path: {
            lists: ["inventory/purchase/return/lists"],
            update: ["inventory/purchase/return/update"]
        }
    },


}