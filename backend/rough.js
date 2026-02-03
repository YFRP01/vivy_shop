    const query='';
    const main='main'
    const category='all'

const queries = (main, category, query) => {
    
    const initialQueryMain = `
            SELECT i.item_id, i.name, i.category, i.liked,`;
    const thumbQuery = `
            (SELECT th.image FROM thumbnails th 
                WHERE th.item_id=i.item_id 
                ORDER BY th.item_id LIMIT 1) AS thumbnail,`;
    const infoQueryMain =  `
                (SELECT json_build_object(
                    'info_id', inf.info_id,
                    'qty', inf.qty,
                    'cost', inf.cost,
                    'details', inf.details
                ) WHERE inf.item_id=i.item_id ORDER BY inf.info_id LIMIT 1) AS info 
                
                `;
    const whereQueryMain = `FROM items i LEFT JOIN infos inf ON inf.item_id=i.item_id ORDER BY i.item_id`;
    const categoryQueryMain = `WHERE i.category ILIKE'%ho%'`
    const orderQueryMain = `ORDER BY i.item_id`;

    //main conditions
    if(main ==='main') {query.push(initialQueryMain)};
    if(main==='main') query+=thumbQuery;
    if(main==='main') query+=infoQueryMain;
    if(main==='main') query+=whereQueryMain;
    if (category !== 'all') query+=categoryQueryMain;
    if(main==='main') query+=orderQueryMain;



    //like queries
    const initialQuerylike = ` 
        SELECT i.item_id, i.name, i.category, i.liked,
        i.created_at::date AS date, i.created_at::time AS time, i.liked,`;
    const objectQueryLike = ` 
        json_build_object(
            'date', o.created_at::date,
            'time', o.created_at::time
        ) AS order `;
    const fromQueryLike = ` 
        FROM items i 
        LEFT JOIN orders o ON o.item_id=i.item_id`
    const whereQueryLike = ` WHERE i.liked=true AND `
    const categoryQueryLike=`i.category ILIKE '%home%'`
    const orderQueryLike=` ORDER BY i.created_at ASC`;

    //like conditions
    if(main!=='main') query+=initialQuerylike;
    if(main==='liked') query+=infoQueryMain;
    if(main==='liked') {
        query+=','
    }
    if(main==='liked') query+=objectQueryLike;
    if(main==='liked') query+=fromQueryLike;
    if(main==='liked') query+=whereQueryLike
    if(category !=='all') query+=categoryQueryLike
    if(main==='liked') query+=orderQueryLike


    //ordered queries
    const infoQueryOrdered =  `
        (
            SELECT json_build_object(
                'cost', inf.cost,
                'details', inf. details
        )
        FROM infos inf WHERE inf.info_id=o.info_id) AS info,`

    const objectQueryordered = `
        json_build_object(
            'order_id', o.order_id,
            'order_qty', o.order_qty,
            'date', o.created_at::date,
            'time', o.created_at::time
        )  AS order`
    const orderQueryOrdered = `
            ORDER BY o.created_at ASC ;`

    //ordered conditions
    if(main ='ordered') query+=initialQuerylike
    if(main==='ordered') query+=infoQueryOrdered
    if(main==='ordered') query+=objectQueryordered
    if(main==='ordered') query+=fromQueryLike
    if(category !== 'all') query+=categoryQueryMain
    if(main==='ordered') query+=orderQueryOrdered


    console.log(`BELOW IS ARE THE QUERIES HAVING main = ${main} AND category = ${category} query`)    
}

export default queries