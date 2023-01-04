const express = require("express");
const path = require("path");
const logger = require("morgan");
const multer = require("multer");

const app = express();
const port = 3000;
const _path = path.join(__dirname, "/dist");
console.log(_path);

const fs = require("fs");

app.use("/", express.static(_path));
app.use(logger("tiny"));

app.get("/test", function (req, res) {
  res.send(`<h3>아이디:${req.query.id}<h3><h3>이름:${req.query.name}<h3>`);
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.post("/info", function (req, res) {
  const name = req.body.testName;
  const age = req.body.testAge;
  const question = req.body.testQuestions;
  const data = name + ", " + age + ", " + question + "\n";

  fs.stat(_path + "/info/" + name + ".txt", (err, stats) => {
    if (stats) {
      fs.appendFile(_path + "/info/" + name + ".txt", data, (e) => {
        if (e) throw e;
        res.send(
          `<script>alert("같은 이름의 파일이 존재합니다. 내용을 추가합니다.");history.go(-1)</script>`
        );
      });
    } else {
      fs.writeFile(_path + "/info/" + name + ".txt", data, (e) => {
        if (e) throw e;
        res.send(
          `<script>alert("파일이 작성 완료되었습니다.");history.go(-1)</script>`
        );
      });
    }

    fs.readFile(_path + "/info/" + name + ".txt", "utf-8", (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  });
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, _path + "/upload");
  },
  filename: (req, res, cb) => {
    let fileName = Buffer.from(res.originalname, "latin1").toString("utf-8");
    cb(null, fileName);
  },
});

let upload = multer({ storage: storage });

app.post("/up", upload.single("fileUpload"), (req, res) => {
  console.log(req.file);
  res.send(`<script>alert("파일 업로드 완료");history.go(-1)</script>`);
});

app.listen(port, () => {
  console.log(port + "에 연결되었습니다.");
});
