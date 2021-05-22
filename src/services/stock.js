import graphql from '../services/graphql'


const STOCK = `
    query ($item_id: uuid!, $order_id: uuid, $date_pickup: date!, $date_back: date!) {
        order_item_aggregate(
            where: {order: {date_pickup: {_lt: $date_back}, date_back: {_gt: $date_pickup}, active: {_eq: true}, id: {_neq: $order_id}}, item_id: {_eq: $item_id}}
        ) {
            aggregate {
                sum {
                    quantity
                }
            }
        }
        items(where: {id: {_eq: $item_id}}) {
            quantity
        }
    }
`;

const getStock = async (items, order_id, date_pickup, date_back) => {
    const promise_items = items.map(
        async item => {
            const _data = await graphql(
                STOCK,
                {
                    item_id: item.id,
                    order_id,
                    date_pickup,
                    date_back
                }
            );
            
            const _item = {
                ...item,
                stock:
                    _data.order_item_aggregate.aggregate.sum.quantity ?
                        _data.items[0].quantity - _data.order_item_aggregate.aggregate.sum.quantity
                        : _data.items[0].quantity
            };
            return _item
        }
    );

    return await Promise.all(promise_items)
        .then(
            items => {
                return items;
            }
        );
}

export default getStock