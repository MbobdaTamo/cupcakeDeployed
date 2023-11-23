import saveImage from './saveImage.js'

const publication = async(req, res,con) => {
    /*if((typeof req.session.user === 'undefined') || (req.session.user === null)) {
        res.send('error')
        return
    }*/
    if(req.body.aim === "newObject") {

        // verification ????

        // case : it is a new publication
        if(req.body.id == -1) {

            // defining imgName and saving images
            let imgName = 'imgNamePub'+Math.random().toString(36).substring(2, 15)+(new Date).getTime()
            let imgIndex = [],images = {image0:'',image1:'',image2:'',image3:'',image4:'',image5:''}
            for(const index in req.files) {
                let i = index[index.length-1]
                imgIndex.push(i)
                images[index] = imgName + i
                let file = {}
                file['image'+i] = req.files[index]
                await saveImage(file,imgName,index[index.length-1])
            }

            //--------- let's now save all the data in the db ---------------------
            
            let d = new Date()
            d = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()
            await con.awaitQuery(`INSERT INTO 
            Product(type,price,name, description,recipe,
                box1,box2,box3,
                perso1,perso2,perso3,
                imgName,img0,img1,img2,img3,img4,img5,creationDate)
            VALUES (${JSON.stringify(req.body.type)},
                ${JSON.stringify(req.body.price)},
                ${JSON.stringify(req.body.name)},
                ${JSON.stringify(req.body.description)},
                ${JSON.stringify(req.body.recipe)},
                
                ${JSON.stringify(req.body.box1)},
                ${JSON.stringify(req.body.box2)},
                ${JSON.stringify(req.body.box3)},

                ${JSON.stringify(req.body.perso1)},
                ${JSON.stringify(req.body.perso2)},
                ${JSON.stringify(req.body.perso3)},
                
                ${JSON.stringify(imgName)},
                ${JSON.stringify(images["image0"])},
                ${JSON.stringify(images["image1"])},
                ${JSON.stringify(images["image2"])},
                ${JSON.stringify(images["image3"])},
                ${JSON.stringify(images["image4"])},
                ${JSON.stringify(images["image5"])},
                ${JSON.stringify(d)}
                )`)
                
                res.send('done')
        }
        else {
            //---- let's update the data as the Publication already saved once
            let imgName = req.body.imgName
            let imgIndex = [],images = {image0:req.body.img0,image1:req.body.img1,
                image2:req.body.img2,image3:req.body.img3,image4:req.body.img4,image5:req.body.img5,}
            for(const index in req.files) {
                let i = index[index.length-1]
                imgIndex.push(i)
                images[index] = imgName + i
                let file = {}
                file['image'+i] = req.files[index]
                await saveImage(file,imgName,index[index.length-1])
            }
            //-- deleting of imgs tobe deleted -------
            for(const index in req.body) {
                if(req.body[index] === 'toDelete' ) {
                    //console.log('the stuffs to be deleted: '+index[index.length-1])
                    images[index] = ''
                }
            }


            await con.awaitQuery(`UPDATE Product SET
            type = ${JSON.stringify(req.body.type)},
            price = ${JSON.stringify(req.body.price)},
            name = ${JSON.stringify(req.body.name)},
            description = ${JSON.stringify(req.body.description)},
            recipe = ${JSON.stringify(req.body.recipe)},

            box1 = ${JSON.stringify(req.body.box1)},
            box2 = ${JSON.stringify(req.body.box2)},
            box3 = ${JSON.stringify(req.body.box3)},

            perso1 = ${JSON.stringify(req.body.perso1)},
            perso2 = ${JSON.stringify(req.body.perso2)},
            perso3 = ${JSON.stringify(req.body.perso3)},

            img0 = ${JSON.stringify(images["image0"])},
            img1 = ${JSON.stringify(images["image1"])},
            img2 = ${JSON.stringify(images["image2"])},
            img3 = ${JSON.stringify(images["image3"])},
            img4 = ${JSON.stringify(images["image4"])},
            img5 = ${JSON.stringify(images["image5"])}
            WHERE id =  ${JSON.stringify(req.body.id)}
            `)
            
            res.send('done')
        }
    }
    else if(req.body.aim === "get") {
        //----- saving of img and getting img indexes sent ----------
        let elts = await con.awaitQuery(`SELECT * FROM Product WHERE deleted = 0`)
        let orders = await con.awaitQuery(`
        SELECT Ordering.id as id, ordererName,ordererTel,ordererQuater
        ,amount,delivery,box,perso,date,product,
        Product.name as productName, Product.price as price
        FROM Ordering, Product
        WHERE Ordering.product = Product.id
        ORDER BY Ordering.id DESC
        LIMIT 100
        `)
        res.send({elts:elts,orders:orders})
    }
    else if(req.body.aim === "delete") {
        await con.awaitQuery(`UPDATE Product SET
        deleted = 1 WHERE id = ${JSON.stringify(req.body.id)}
        `)
        res.send('done')
    }
    
    
    
    
    
    
    
    else if(req.body.aim === "close") {
        await con.awaitQuery(`UPDATE Object SET
        deleted = 2 WHERE id = ${JSON.stringify(req.body.id)}
        AND HEX(AES_ENCRYPT(creator, 'benjaminmendy2000')) = ${JSON.stringify(req.body.user)}
        `)
        res.send('done')
    }


    else if(req.body.aim === "getOne") {
        let pubs = await con.awaitQuery(`
        SELECT
        Object.id as id,type,description,Country,city,price,
        state,imgName,img0,img1,img2,img3,
        DATE_FORMAT(creationDate,"%Y-%m-%d") as creationDate,
        User.name as creator,User.tel as tel,
        User.img as userImg, 
        HEX(AES_ENCRYPT(User.id, 'jermyDoku2023')) AS userId
        FROM Object, User
        WHERE deleted = 0 
        AND Object.id = ${JSON.stringify(req.body.id)}
        AND creator = User.id
        `)
        res.send(pubs[0])
    }
    else if(req.body.aim === "sort") {
        let pubs = await con.awaitQuery(`
        SELECT
        Object.id as id,type,price,description,Country,city,
        state,imgName,img0,img1,img2,img3,
        DATE_FORMAT(creationDate,"%Y-%m-%d") as creationDate,
        User.name as creator,User.tel as tel,
        User.img as userImg,
        HEX(AES_ENCRYPT(User.id, 'jermyDoku2023')) AS userId
        FROM Object, User
        WHERE Object.city = ${JSON.stringify(req.body.city)}
        AND Object.type = ${JSON.stringify(req.body.type)}
        AND (description LIKE ${JSON.stringify('%'+req.body.search +'%')} OR ${JSON.stringify(req.body.search)} LIKE description)
        AND deleted = 0 
        AND Object.creator = User.id
        ORDER BY Object.id DESC LIMIT 80
        `)
        res.send(pubs)
    }
    else if(req.body.aim === "getMessage") {
        
        //------ if message id have being loaded if not load it ------------------------
        if((typeof req.session.myId === 'undefined') || req.session.myId === null ) {
            let id = await con.awaitQuery (`
                SELECT id, 
                HEX(AES_ENCRYPT(id, 'jermyDoku2023')) as msgId FROM User
                WHERE HEX(AES_ENCRYPT(id, 'benjaminmendy2000')) = ${JSON.stringify(req.body.user)}
            `)
            req.session.myId = id[0].id
        }



        //----- saving message----------
        if(req.body.sendMessage === 'yes') {
            let content = req.body.content
            if(req.body.type === 'img') {
                content = 'messageImg'+Math.random().toString(36).substring(2, 15)+(new Date).getTime()
                let file = {}
                file['image'] = req.files['image']
                await saveImage(file,content,'')
            }
            
            await con.awaitQuery(`INSERT INTO
            Message (type,authorRead, content, creationDate, receiver, author)
            VALUES (${JSON.stringify(req.body.type)},
            1,
            ${JSON.stringify(content)},
            CURRENT_TIMESTAMP(),
            CAST(UNHEX(HEX(AES_DECRYPT(UNHEX(${JSON.stringify(req.body.receiver)}),'jermyDoku2023'))) AS CHAR(100)),
            ${JSON.stringify(req.session.myId)}
            )`)
        }


        //------- update messages ----------------------------------
        if((typeof req.session.lastMsgDate === 'undefined') || (req.session.lastMsgDate === null) 
        || req.body.firstLoad === 'yes') {
            req.session.lastMsgDate = 0
        }
        let messages = await con.awaitQuery(`
        SELECT Message.id as id,type,content,authorRead,receiverRead,
        DATE_FORMAT(creationDate,'%Y-%m-%d %H:%i:%s') as creationDate,
        HEX(AES_ENCRYPT(receiver, 'jermyDoku2023')) AS receiver,
        HEX(AES_ENCRYPT(author, 'jermyDoku2023')) AS author,
        HEX(AES_ENCRYPT(User.id, 'jermyDoku2023')) AS person2Id,
        (author = ${JSON.stringify(req.session.myId)}) as isAuthor,
        User.name as person2Name, User.img as person2Img
        FROM Message,User
        WHERE 
        (
        receiver = ${JSON.stringify(req.session.myId)}
        AND Message.id > ${JSON.stringify(req.body.lastMsgId)}
        AND User.id = author 
        AND author != ${JSON.stringify(req.session.myId)}
        )

        OR
        
        (
        author = ${JSON.stringify(req.session.myId)}
        AND Message.id > ${JSON.stringify(req.body.lastMsgId)}
        AND User.id = receiver 
        AND receiver != ${JSON.stringify(req.session.myId)}
        )
        ORDER BY id ASC
        `)

        if(messages.length > 0) req.session.lastMsgDate = messages[messages.length-1].id
        res.send({messages:messages,lastId:req.session.lastMsgDate})
    }
    else if(req.body.aim === "setRead") {
        await con.awaitQuery (`
        UPDATE Message SET receiverRead = 1
        WHERE 
            HEX(AES_ENCRYPT(author, 'jermyDoku2023')) = ${JSON.stringify(req.body.person2)} 
            AND receiver = ${JSON.stringify(req.session.myId)}
    `)
        res.send('done')
    }
    else if(req.body.aim === "getMessageId") {
        let id = await con.awaitQuery (`
            SELECT id, 
            HEX(AES_ENCRYPT(id, 'jermyDoku2023')) as msgId FROM User
            WHERE HEX(AES_ENCRYPT(id, 'benjaminmendy2000')) = ${JSON.stringify(req.body.user)}
        `)
        req.session.myId = id[0].id
        res.send(id[0].msgId)
    }











}
export default publication  
