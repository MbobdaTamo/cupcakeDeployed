
const client = async(req, res,con) => {
    
    if(req.body.aim === "get") {
        let elts = await con.awaitQuery(`SELECT * FROM Product WHERE deleted = 0`)
        res.send({elts:elts})
    }
    else if(req.body.aim === "getOne") {
        let elts = await con.awaitQuery(`SELECT * FROM Product 
        WHERE deleted = 0 AND id=${JSON.stringify(req.body.id)}`)
        res.send(elts[0])
    }
    else if(req.body.aim === 'order') {
        if((typeof req.session.ordered === 'undefined') || (req.session.ordered === null)) {
            req.session.ordered = 0
        }
        else if (req.session.ordered > 14) {
            res.send('tooMore')
            return
        }


        await con.awaitQuery(`INSERT INTO 
            Ordering(ordererName,ordererTel,ordererQuater
                ,amount,delivery,box,perso,date,product)
            VALUES (${JSON.stringify(req.body.ordererName)},
                ${JSON.stringify(req.body.ordererTel)},
                ${JSON.stringify(req.body.ordererQuater)},
                ${JSON.stringify(req.body.amount)},
                ${JSON.stringify(req.body.transport)},
                ${JSON.stringify(req.body.box)},
                ${JSON.stringify(req.body.perso)},
                NOW(),
                ${JSON.stringify(req.body.productId)}
                )`)

                req.session.ordered ++
                res.send('done')
    }


}
export default client 
