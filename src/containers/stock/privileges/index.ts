export default {
    stockTransfer: {
        title: "Stock Transfer",
        path: {
            create: ["inventory/stock/transfer/create"],
            lists: ["inventory/stock/transfer/lists"],
            update: ["inventory/stock/transfer/update"]
        }
    },
    approveStockTransfer: {
        title: "Approve Stock Transfer",
        path: {
            approve: ["inventory/stock/approve/update"]
        }
    },
    stockAdjustment: {
        title: "Stock Adjustment",
        path: {
            create: ["inventory/stock/adjustment/create"],
            lists: ["inventory/stock/adjustment/lists"],
            update: ["inventory/stock/adjustment/update"],
            approve: ["inventory/stock/adjustment/approve"],
            archive: ["inventory/stock/adjustment/archive"]
        }
    },
    movementLog: {
        title: "Movement Log",
        path: {
            lists: ["movementLog/lists"]
        }
    },
    eodLog: {
        title: "EOD Log",
        path: {
            lists: ["eodLog/lists"]
        }
    },

}