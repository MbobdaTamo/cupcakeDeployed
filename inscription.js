
const user = async(req, res,con) => {
    
    if (req.body.type === 'login') {
        let userInfos = await con.awaitQuery(`
            SELECT *
            FROM User
            WHERE login = ${JSON.stringify(req.body.login)}
            AND password = ${JSON.stringify(req.body.password)}`)
        if(userInfos.length == 0) {
            res.send('notExist')
            return
        }
        req.session.user = userInfos
        res.send('exist')
    }
    else if (req.body.type === 'change') {
        if((typeof req.session.user === 'undefined') || (req.session.user === null)) {
            res.send('error')
            return
        }
        let userInfos = await con.awaitQuery(`
            SELECT *
            FROM User
            WHERE login = ${JSON.stringify(req.body.login)}
            AND password = ${JSON.stringify(req.body.password)}`)
        if(userInfos.length == 0) {
            res.send('login or password incorrect')
            return
        }

        await con.awaitQuery (`
        UPDATE User SET 
            login = ${JSON.stringify(req.body.newLogin)},
            password = ${JSON.stringify(req.body.newPassword)}
            WHERE id = ${JSON.stringify(userInfos[0].id)}
        `)
        res.send('done')
    }
}
export default user