export default {
    brand: {
        title: "Brand",
        path: {
            create: ["inventory/brand/create"],
            lists: ["inventory/brand/lists"],
            update: ["inventory/brand/update"],
            archive: ["inventory/brand/archive"]
        }
    },
    product_type: {
        title: "Product Type",
        path: {
            create: ["inventory/product/type/create"],
            lists: ["inventory/product/type/lists"],
            update: ["inventory/product/type/update"],
            archive: ["inventory/product/type/archive"]
        }
    },
    product_unit: {
        title: "Unit",
        path: {
            create: ["unit/create"],
            lists: ["unit/lists"],
            update: ["unit/update"],
            archive: ["unit/archive"]
        }
    },
    product: {
        title: "Product",
        path: {
            create: ["inventory/product/create"],
            lists: ["inventory/product/lists"],
            update: ["inventory/product/update"]
        }
    },
    supplier: {
        title: "Supplier",
        path: {
            create: ["inventory/supplier/create"],
            lists: ["inventory/supplier/lists"],
            update: ["inventory/supplier/update"],
            archive: ["inventory/supplier/archive"]
        }
    }
}