var express = require("express");
var router = express.Router();
var multer = require("multer");

// multer

var fs = require("fs");
var db = 'mongodb+srv://admin:ndthinh1410@cluster0.ikuee.mongodb.net/testmongo?retryWrites=true&w=majority'
var mongo = require('mongoose')
const mongoose = require("mongoose");
mongo.connect(db).catch(err => {
    console.log("xay ra loi" + err)
})

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {title: "Express"});
});
router.get("/index", function (req, res, next) {
    res.render("index", {title: "Express"});
});
router.get('/ListCar', function (req, res) {
    res.render("ListCar", {mess: ""})
})
var carSchema = new mongoose.Schema({
    name: 'string',
    content: 'string',
    url: 'string'

})


var Car = mongoose.model('car', carSchema);
// show All
router.get('/ShowAll', function (req, res) {
    Car.find({}, function (err, data) {
        res.render("ShowAll", {data: data})
        // console.log(data)
    })

});
router.post("/addCar", function (req, res) {
    var name = req.body.name;
    var content = req.body.content;
    var url = req.body.url;
    const car = new Car({
        name: name,
        content: content,
        url: url
    })
    car.save(function (err) {
        var mess;
        if (err == null) {
            mess = "Them thanh cong"
        } else {
            mess = err;
        }
        res.render("ListCar", {mess: mess})
    })


    // console.log(price)
})
// delete mongo
router.post("/delete", function (req, res) {
    var id = req.body.id;
    // console.log(id)
    Car.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/ShowAll')
        }
    })


})
// update
router.post("/update", function (req, res) {
    var id = req.body.idUp;


    Car.findById(id, function (err, data) {
        res.render("update", {data: data})
        // console.log(data)

    })
})
router.post("/updateCar", function (req, res) {
    var id = req.body.ids;
    var name = req.body.name;
    var content = req.body.content;
    var url = req.body.url;
    console.log(id)
    Car.findByIdAndUpdate(id, {name: name,content:content,url:url}, (err, data) => {
        res.render("update",{data:data})
        console.log(data)
    })
})


router.get("/asia", function (req, res, next) {
    var name = "Duc Thinh";
    var tuoi = "20";
    var arr = [0, 2, 31321, 302, 31, 2];
    var students = {name: "Dthinh", phoneNumber: "0372546891"};
    var list = [
        {
            albumId: 1,
            id: 1,
            title: "accusamus beatae ad facilis cum similique qui sunt",
            url: "https://via.placeholder.com/600/92c952",
            thumbnailUrl: "https://via.placeholder.com/150/92c952",
        },
        {
            albumId: 1,
            id: 2,
            title: "reprehenderit est deserunt velit ipsam",
            url: "https://via.placeholder.com/600/771796",
            thumbnailUrl: "https://via.placeholder.com/150/771796",
        },
    ];
    // console.log(list[1].title)
    var inf = {
        name: "thinh",
        phoneNumber: "0372546891",
        list: [
            {name: "thinh", phoneNumber: "0372546891"},
            {name: "thinh", phoneNumber: "0372546891"},
            {name: "thinh", phoneNumber: "0372546891"},
        ],
    };
    res.render("category", {
        title: "Asia",
        name: name,
        tuoi: tuoi,
        arr: arr,
        students: students,
        list: list,
        inf: inf,
    });
});
router.get("/euro", function (req, res, next) {
    res.render("euro", {title: "Euro"});
});
router.get("/american", function (req, res, next) {
    res.render("american", {title: "America"});
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb dung de kiem tra file co the luu tru hay khong
        // cb duoc dung de thay doi duong dan, thay doi ten file
        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, "renderFile");
        } else {
            cb(new Error("not image"), null)
        }


    },
    filename: function (req, file, cb) {
        // chung ta se de nguyen ten file khong thay doi
        // cb(null, file.originalname);
        cb(null, Date.now() + ".jpg")
    },
    // file name : tên trường được chỉ định trong biểu mãu
    // originalname : tên tệp máy tính người dùng
    // encoding : mã hóa tệp
    //diskStorage: des : đường dẫn cần lưu, filenamed : tên của tệp bỏ đuôi, path: đường dẫn
});

var upload = multer({storage: storage, limits: {fileSize: 2 * 1024 * 1024}}).array('images', 5);
router.get("/uploadFile", function (req, res, next) {
    res.render("uploadFile");
});
router.post("/uploadFile", function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            return res.send("File nang qua , be hon 2mb di bro,nho chon anh duoi jpg thoi  nhe")
        }

        res.send("thanh cong")
    })


})
router.get("/showdetail", function (req, res, next) {
    fs.readFile("Luu/data.txt", "utf8", (err, datas) => {
        var arr = datas.toString(); // chuyen tu string sang json
        var shows = eval(arr);
        if (err) {
            console.error(err);
            return;
        }
        res.render("showdetail", {show: shows});
        console.log(shows[2].id);
    });
});

router.get("/about", function (req, res, next) {
    res.render("about", {title: "About", mess: ""});
});

router.post("/support", function (request, response) {
    var email = request.body.emaill;
    var phone = request.body.phone;
    var content = request.body.contentt;

    fs.appendFile(
        "Luu/" + "uploads.txt",
        "Email: " +
        email +
        "\n" +
        "Phone number: " +
        phone +
        "\n" +
        "Content: " +
        content +
        "\n",

        function (error) {
            var mess = "";
            if (error) {
                mess = error;
            } else {
                mess = "Thank you for your feedback, have a nice day !";
            }
            response.render("about", {title: "ok", mess: mess});
        }
    );

    // response.render('about',{title:'OK bro' , message : email + "," + " Phone : "+phone})
});

module.exports = router;
