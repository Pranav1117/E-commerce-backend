const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const Product = require("../model/Products");
const UserModel = require("../model/Users");

const SECRET_KEY = process.env.SecretKey;

let StoredData = [];

const SignIn = async (req, res) => {
  const { email, password } = req.body;

  const User = await UserModel.findOne({ email: email });
  console.log(User);

  if (!User) {
    return res.send({ msg: "User is not registered" });
  }

  const isMatch = bcrypt.compareSync(password, User.password);

  if (isMatch) {
    const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "3D" });

    return res.send({ msg: "User logged in successfully", token: token });
  } else {
    return res.send({ msg: "please enter correct password" });
  }
};

const Register = async (req, res) => {
  const { name, email, password, phoneNo, address } = req.body;

  const User = await UserModel.findOne({ email });
  console.log(User, "user msgggg");

  if (User) {
    return res.send({ msg: "User already registered" });
  }

  const hashPass = bcrypt.hashSync(password, 10);

  const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "3D" });

  const tempObj = new UserModel({
    name: name,
    email: email,
    phoneNo: phoneNo,
    address: address,
    password: hashPass,
  });

  await tempObj.save();
  StoredData.push(tempObj);

  return res.send({ msg: "User succesfully registered", token: token });
};

const data = async (req, res) => {
  // res.send([
  //   {
  //     ids: 1,
  //     category: "men",
  //     subcategory: "tshirt",
  //     product: "Relaxed Fit Printed T-shirt",
  //     price: 799.0,
  //     description:
  //       "Relaxed-fit T-shirt in soft cotton jersey with a print motif. Rib-trimmed neckline, dropped shoulders and a straight-cut hem.",
  //     rating: 5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fc5%2Fc8%2Fc5c8d473707746ea69fdaf65d8ed728230727b1a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 2,
  //     category: "men",
  //     subcategory: "tshirt",
  //     product: "Relaxed Fit Printed T-shirt",
  //     price: 799.0,
  //     description:
  //       "Relaxed-fit T-shirt in soft cotton jersey with a print motif, round, rib-trimmed neckline, dropped shoulders and a straight-cut hem.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F5d%2Fe7%2F5de7dd7cbd8b56d0e75340665570aacfdfea43b8.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 3,
  //     category: "men",
  //     subcategory: "tshirt",
  //     product: "Relaxed Fit Sweatshirt",
  //     price: 799.0,
  //     description:
  //       "Top in sweatshirt fabric made from a cotton blend. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem. Soft brushed inside.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F83%2F01%2F8301f22eab3b69d612404f26750728949010c3c3.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
  //   },
  //   {
  //     ids: 4,
  //     category: "men",
  //     subcategory: "tshirt",
  //     product: "Relaxed Fit Printed T-shirt",
  //     price: 559.0,
  //     description:
  //       "Relaxed-fit T-shirt in soft cotton jersey with a print motif. Rib-trimmed neckline, dropped shoulders.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fb9%2Ff0%2Fb9f06e5ae419ea95569ba1b90ea8807042378dfb.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 5,
  //     category: "men",
  //     subcategory: "tshirt",
  //     product: "Relaxed Fit Sweatshirt",
  //     price: 2299.0,
  //     description:
  //       "Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem.",
  //     rating: 5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fb0%2Fe6%2Fb0e612d9477e38d7fb66f79bb79042d4f26dce8c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_hoodiessweatshirts_sweatshirts%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
  //   },
  //   {
  //     ids: 6,
  //     category: "men",
  //     subcategory: "shirt",
  //     product: "Regular Fit Corduroy shirt",
  //     price: 1499.0,
  //     description:
  //       "Regular-fit shirt in soft cotton corduroy with a turn-down collar, classic front, open chest pocket and yoke at the back. Long sleeves with buttoned cuffs and a sleeve placket with a link button. Rounded hem.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F53%2F86%2F53862fe2d490c137b387773ae32d73f1487ea0a6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 7,
  //     category: "men",
  //     subcategory: "shirt",
  //     product: "Regular Fit Checked shirt",
  //     price: 1999.0,
  //     description:
  //       "Regularf-fit shirt in a checked, lightly brushed cotton weave with a turn-down collar, French front and yoke at the back. Long sleeves with adjustable buttoning at the cuffs, and a rounded hem.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F9c%2Fa6%2F9ca690284cd21ad5fe0acfa8d1d672476342cd93.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 8,
  //     category: "men",
  //     subcategory: "shirt",
  //     product: "Regular Fit Textured-weave shirt",
  //     price: 1999.0,
  //     description:
  //       "Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem.",
  //     rating: 2.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Faf%2Fe1%2Fafe1bdce20c1065bd15ff24fd49c248478c8e671.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 9,
  //     category: "men",
  //     subcategory: "shirt",
  //     product: "Twill overshirt",
  //     price: 2699.0,
  //     description:
  //       "Overshirt in twill with a collar, buttons down the front and a yoke at the back. Flap chest pockets with a button, and long sleeves with buttoned cuffs.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F4f%2Fbc%2F4fbce4ae63887ddf5610da8a19623a2593375391.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 10,
  //     category: "men",
  //     subcategory: "shirt",
  //     product: "Regular Fit Short-sleeved shirt",
  //     price: 999.0,
  //     description:
  //       "Regular-fit shirt in a printed cotton weave with a turn-down collar, classic front, short sleeves and a yoke at the back. Open chest pocket and a gently rounded hem.",
  //     rating: 5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ff2%2Fc9%2Ff2c9f1ce32e411ae31b8356a0f7fb54314f95f5c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 11,
  //     category: "men",
  //     subcategory: "trousers",
  //     product: "Relaxed Fit Cotton cargo joggers",
  //     price: 2999.0,
  //     description:
  //       "Joggers in cotton twill with covered elastication and a drawstring at the waist. Side pockets, and a back pocket and leg pockets with a flap and press-studs. Covered elastication and a hook and loop tab at the hems.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F60%2F2a%2F602a44c930651379edfb0cb30ca9c62d337fbf2d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 12,
  //     category: "men",
  //     subcategory: "trousers",
  //     product: "Relaxed Fit Cotton cargo joggers",
  //     price: 2999.0,
  //     description:
  //       "Joggers in cotton twill with covered elastication and a drawstring at the waist. Side pockets, and a back pocket and leg pockets with a flap and press-studs. Covered elastication and a hook and loop tab at the hems.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F6b%2F28%2F6b28dd1c9e78ea180ec8c8dfb4322b1ce09c54af.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 13,
  //     category: "men",
  //     subcategory: "trousers",
  //     product: "Relaxed Denim Joggers",
  //     price: 2299.0,
  //     description:
  //       "Joggers in rigid cotton denim with a straight leg and a regular fit from the waist to the hem with a comfortable, looser feel around the whole leg. Regular waist with covered elastication and a drawstring, a fake fly, pockets in the side seams and an open back pocket. Covered elastication at the hems.",
  //     rating: 5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fc7%2F3b%2Fc73b505dc1b01608f7e8cf939baa1d60426e6088.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
  //   },
  //   {
  //     ids: 14,
  //     category: "men",
  //     subcategory: "trousers",
  //     product: "Regular Fit Sweatpants",
  //     price: 1499.0,
  //     description:
  //       "Regular-fit sweatpants in sweatshirt fabric made from a cotton blend. Covered elastication and a drawstring at the waist, pockets in the side seams and ribbed hems. Soft brushed inside.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F7b%2F39%2F7b3977bd0958b6ab93bb07e7f6dcce7cb635760c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 15,
  //     category: "men",
  //     subcategory: "trousers",
  //     product: "Loose Denim Joggers",
  //     price: 2299.0,
  //     description:
  //       "Joggers in sturdy cotton denim with a rounded leg and a loose fit from the seat to the hem with a dropped crotch and extra room around the whole leg. Regular waist with covered elastication and a concealed drawstring. Side pockets, open back pockets and a fake fly. All you need to conquer the full denim look.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F7e%2F93%2F7e9393be7ac88ae2ff57801ab748be069466e0fb.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 16,
  //     category: "men",
  //     subcategory: "jackets",
  //     product: "Imitation leather jacket",
  //     price: 5499.0,
  //     description:
  //       "Jacket in soft imitation leather with a collar, zip down the front and buttoned cuffs. Two inner pockets, and diagonal side pockets with a concealed press-stud. Lined.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fc3%2F15%2Fc315fa517f75e69b5e54217dba423202dbb41017.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 17,
  //     category: "men",
  //     subcategory: "jackets",
  //     product: "Padded lightweight gilet",
  //     price: 2299.0,
  //     description:
  //       "Padded gilet in quilted nylon with a hood, zip down the front with a chin guard and discreet zipped pockets in the side seams. Elasticated trim around the hood, armholes and hem. Lined.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F02%2F9b%2F029b95bcf2e8c1a5d43741d5f5b7f264566d518a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 18,
  //     category: "men",
  //     subcategory: "jackets",
  //     product: "Regular Fit Windbreaker",
  //     price: 2699.0,
  //     description:
  //       "Regular-fit windbreaker in windproof, water-repellent nylon. Lined hood with an elasticated drawstring, a zip down the front and long sleeves with covered elastication at the cuffs. Zipped side pockets and an inner pocket with a press-stud. Concealed, elasticated drawstring at the hem. Lined.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ffb%2F09%2Ffb099c38d85c7010250a9801384721087076cd56.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 19,
  //     category: "men",
  //     subcategory: "jackets",
  //     product: "Regular Fit Baseball jacket",
  //     price: 6999.0,
  //     description:
  //       "Disney100 x H&M. In celebration of Disney's 100th anniversary, artist and former professional snowboarder Trevor Andrew has created this streetwear-inspired collection featuring new takes on some of the studio's most beloved characters. This baseball jacket is made from a soft, felted weave with embroidered motifs on the front and back.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F66%2F7d%2F667d41e91b8e8ffebd0f2c4746de0ca95d1c1228.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 20,
  //     category: "men",
  //     subcategory: "jackets",
  //     product: "Baseball jacket",
  //     price: 2999.0,
  //     description:
  //       "Baseball jacket in woven fabric with an embroidered motif on the front. Ribbed stand-up collar, press-studs down the front, long sleeves and wide ribbing at the cuffs and hem. Diagonal jetted pockets at the front and an inner pocket with a press-stud. Lined.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F35%2F34%2F35346fc48c44c09423af5af39cfd790c80073a4e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 21,
  //     category: "men",
  //     subcategory: "shorts",
  //     product: "Printed sweatshirt shorts",
  //     price: 1999.0,
  //     description:
  //       "Knee-length shorts in sweatshirt fabric with a print motif and an elasticated, drawstring waist.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F28%2Fd9%2F28d940fa88a9c924576257d1c7b1ae1f2b7ff649.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 22,
  //     category: "men",
  //     subcategory: "shorts",
  //     product: "Regular Fit Sweatshorts",
  //     price: 799.0,
  //     description:
  //       "Shorts in lightweight sweatshirt fabric made from a cotton blend. Regular fit with an elasticated, drawstring waist, side pockets, an open back pocket and raw, roll-edge hems.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F18%2Fac%2F18acc8a9aa27b55a793d8b9407ae5a5364e94cd0.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 23,
  //     category: "men",
  //     subcategory: "shorts",
  //     product: "Regular Fit Sweatshorts",
  //     price: 799.0,
  //     description:
  //       "Shorts in lightweight sweatshirt fabric made from a cotton blend. Regular fit with an elasticated, drawstring waist, side pockets, an open back pocket and raw, roll-edge hems.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fbe%2F21%2Fbe2183ae86d547e53278942f0d44d271f1559525.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
  //   },
  //   {
  //     ids: 24,
  //     category: "men",
  //     subcategory: "shorts",
  //     product: "Printed sweatshirt shorts",
  //     price: 2299.0,
  //     description:
  //       "Relaxed-fit, knee-length cargo shorts in nylon with covered elastication and an elasticated drawstring that has a cord stopper at the waist. Fake fly, zipped side pockets, welt back pockets and a bellows pocket with concealed press-studs on each leg, one with a zipped pocket on top.",
  //     rating: 4.5,
  //     image:
  //       "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fca%2Fc9%2Fcac9a88464d81148015c221e95df2a548b37e2ff.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
  //   },
  //   {
  //     ids: 25,
  //     category: "men",
  //     subcategory: "shorts",
  //     product: "Hybrid Regular Denim shorts",
  //     price: 2299.0,
  //     description:
  //       "5-pocket jogger shorts in stretch denim made from a cotton blend. Regular waist with a concealed drawstring at the front and covered elastication at the back, and a zip fly with a button. Straight legs with good room for movement over the thighs and knees. ",
  //     rating: 4.5,
  //     image:
  //       "hhttps://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ff5%2F64%2Ff5646551d8ea33c6d32089e07d6d57dd26e009de.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
  //   },
  //   {
  //     ids: 26,
  //     category: "electronics",
  //     subcategory: "earphone",
  //     product: "boAt Rockerz 255 Pro+ /258 Pro+",
  //     price: 999,
  //     description:
  //       "boAt Rockerz 255 Pro+ is a power-packed in-ear wireless neckband headphone that has been ergonomically designed to meet the needs of music lovers. The headphones come equipped with Bluetooth V5.0 for instant wireless connectivity.",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/l31x2fk0/headphone/a/s/h/-original-image9ehehz8amg2.jpeg?q=70",
  //   },
  //   {
  //     ids: 27,
  //     category: "electronics",
  //     subcategory: "earphone",
  //     product: "realme Buds 2 Wired Headset ",
  //     price: 599,
  //     description:
  //       "Hear every soundtrack even more clearly when you use these Realme Buds 2 earphones. They come with the powerful 11.2-mm bass boost driver for elevated bass response. Moreover, these stylishly designed earphones have integrated magnets which offer a hassle-free way of storing them. ",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/k20r8nk0/headphone/7/w/c/realme-buds-2-original-imafhgrckbygsyrk.jpeg?q=70",
  //   },
  //   {
  //     ids: 28,
  //     category: "electronics",
  //     subcategory: "earphone",
  //     product: "Mi Basic Wired Headset with Mic",
  //     price: 447,
  //     description:
  //       "Super Extra Bass, Metal Sound Chamber, Dynamic Bass, HD Clear Sound, Aerospace Grade Metal Diaphragm For a Resonating Bass",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/krntoy80/headphone/j/l/n/ydjc01jy-mi-original-imag5egze7eb9taj.jpeg?q=70",
  //   },
  //   {
  //     ids: 29,
  //     category: "electronics",
  //     subcategory: "earphone",
  //     product: "JBL C150SI",
  //     price: 747,
  //     description:
  //       "You can enjoy the sound of deepened notes with stellar bass response and manage your calls conveniently with the JBL C150SI wired headset. It features a one-button universal remote that helps you operate this headset with ease. ",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/juwzf680/headphone-refurbished/7/h/k/z-c100si-jbl-original-imaffxja5vmgwudz.jpeg?q=70",
  //   },
  //   {
  //     ids: 30,
  //     category: "electronics",
  //     subcategory: "earphone",
  //     product: "SONY EX14AP Wired Headset",
  //     price: 549,
  //     description:
  //       "Enhance your aural experience with this pair of Sony in-the-ear headphones, thanks to its 9 mm Neodymium Drivers and 8 Hz–22 kHz Frequency Range for clear, powerful and balanced sound.In-line Mic for Hands-free Calling",
  //     rating: 4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kjym9ow0/headphone/headphone/v/s/e/mdr-ex14ap-sony-original-imafzetchwdhn9jx.jpeg?q=70",
  //   },
  //   {
  //     ids: 31,
  //     category: "electronics",
  //     subcategory: "airpods",
  //     product: "Apple AirPods(2nd gen)",
  //     price: 8999,
  //     description:
  //       "The new AirPods combine intelligent design with breakthrough technology and crystal clear sound. Powered by the new Apple H1 headphone chip, AirPods now feature hands-free access to Siri using just your voice. And up to 3 hours of talk time on a single charge.Specifications",
  //     rating: 4.5,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kpinwy80/headphone/x/r/e/mmef2hn-a-apple-original-imag3qe9hphsevrt.jpeg?q=70",
  //   },
  //   {
  //     ids: 32,
  //     category: "electronics",
  //     subcategory: "airpods",
  //     product: "APPLE AirPods (3rd generation) ",
  //     price: 16990,
  //     description:
  //       "Introducing the all-new AirPods. Featuring spatial audio that places sound all around you, Adaptive EQ that tunes music to your ears, and longer battery life. It�s all sweat and water resistant and delivers an experience that�s simply magical.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kwdv3bk0/headphone/q/o/x/-original-imag92pgct73fbvx.jpeg?q=70",
  //   },
  //   {
  //     ids: 33,
  //     category: "electronics",
  //     subcategory: "airpods",
  //     product: "Mestie Bluetooth Earphones I12 TWS ",
  //     price: 423,
  //     description:
  //       "True wireless Bluetooth earphones Charging Case + Super Mini is a wireless charging to use the whole day without any irritation. It is specially designed for your soft ears with the latest and new model for a complete solution for your all worries while you are in the gym, driving, or running. Use Headset to make your life stress less.",
  //     rating: 3.4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/n/s/y/bluetooth-earphones-i12-tws-with-in-built-mic-bluetooth-headset-original-imagqctvfad6gb9k.jpeg?q=70",
  //   },
  //   {
  //     ids: 34,
  //     category: "electronics",
  //     subcategory: "airpods",
  //     product: "Noise Buds VS102",
  //     price: 999,
  //     description:
  //       "You can enjoy up to 50 hours of music, movies, or binge watch all night long with these Noise Buds VS102 earbuds. In addition to its excellent audio quality it has a stunning flybird design which makes it trendy. With its quick charging feature, you can enjoy your favourite content all day long.",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/d/q/r/-original-imagp6skt77zsdjt.jpeg?q=70",
  //   },
  //   {
  //     ids: 35,
  //     category: "electronics",
  //     subcategory: "airpods",
  //     product: "Noise Buds VS102",
  //     price: 899,
  //     description:
  //       "You can enjoy up to 50 hours of music, movies, or binge watch all night long with these Noise Buds VS102 earbuds. In addition to its excellent audio quality it has a stunning flybird design which makes it trendy. With its quick charging feature, you can enjoy your favourite content all day long. ",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/p/0/p/-original-imagp6skfbnypq5g.jpeg?q=70",
  //   },
  //   {
  //     ids: 36,
  //     category: "electronics",
  //     subcategory: "Tv",
  //     product: "OnePlus Y1S 32 inch LED Smart Android TV",
  //     price: 12499,
  //     description:
  //       "You can watch your favourite movies, shows, and other content on this OnePlus TV. Sporting a slim bezel-less design, this TV is designed to offer an enhanced viewing experience. Powered by an AI-driven Gamma Engine, this TV provides lifelike visuals with brilliant colours.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kzfvzww0/television/e/b/b/32hd2a00-32-y1s-oneplus-original-imagbgcewfqywgk7.jpeg?q=70",
  //   },
  //   {
  //     ids: 37,
  //     category: "electronics",
  //     subcategory: "Tv",
  //     product: "realme32 inch Ready LED Smart Android TV",
  //     price: 11999,
  //     description:
  //       "Bring home this TV from realme and experience the stunning visuals that result from its Chroma Boost Picture Engine. Boasting a Bezel-less design and Dolby Surround Audio, this Android TV blends right into your decor",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/television/h/a/r/-original-imaghgphdj9fsvzt.jpeg?q=70",
  //   },
  //   {
  //     ids: 38,
  //     category: "electronics",
  //     subcategory: "Tv",
  //     product: "LG UQ7500 43 inch Ultra (4K) LED Smart WebOS TV",
  //     price: 28990,
  //     description:
  //       "Get larger than life visuals and unmatched movie watching experience on the LG UHD TV. This TV comes with a UHD 4K resolution display so that you can get a true-to-life visual quality and vivid colours. and streaming services with the With pre-installed streaming services on this TV, you can conveniently browse through your preferred content throughout the day.",
  //     rating: 4.4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/television/n/h/y/-original-imagg24zpbk2h7tx.jpeg?q=70",
  //   },
  //   {
  //     ids: 39,
  //     category: "electronics",
  //     subcategory: "Tv",
  //     product: "Mi X Series 43 inch Ultra HD (4K) LED Smart Google TV",
  //     price: 28999,
  //     description:
  //       "he Xiaomi X Series TV presents an unparalleled home entertainment experience with its 4K clarity, bezel-less design, Dolby Vision, Vivid Picture Engine, extensive colour gamut, MEMC Engine Reality Flow, powerful sound, Google TV integration, Patchwall and Patchwall+ access, optimised performance, ",
  //     rating: 4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/television/g/s/l/l43m8-a2in-xiaomi-original-imagrzmzvmedcpzf.jpeg?q=70",
  //   },
  //   {
  //     ids: 40,
  //     category: "electronics",
  //     subcategory: "Tv",
  //     product:
  //       "Acer Advanced I Series 43 inch Ultra HD (4K) LED Smart Google TV ",
  //     price: 23999,
  //     description:
  //       "You can bring home the world of entertainment with the Acer Advanced I Series LED Smart Google TV. This Google TV allows you to personalise profiles for every user at home based on your interests. With Dolby Vision you can enjoy crystal clear and detailed visuals on this TV. ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/television/a/2/z/-original-imagqh768aaghnuy.jpeg?q=70",
  //   },
  //   {
  //     ids: 41,
  //     category: "electronics",
  //     subcategory: "powerbank",
  //     product: "Ambrane 10000 mAh Power Bank",
  //     price: 699,
  //     description: "Ambrane Capsule 10k is a 10000 mAh lithium",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/o/l/w/pp-111-10000-ambrane-original-imagg7nprsfvwttp.jpeg?q=70",
  //   },
  //   {
  //     ids: 42,
  //     category: "electronics",
  //     subcategory: "powerbank",
  //     product: "Mi 3i 10000 mAh Power Bank",
  //     price: 1299,
  //     description:
  //       "Take this lightweight and stylish powerbank along with you when you’re traveling so that you can always keep your devices juiced up. Featuring two USB output ports, this 10000 mAh powerbank from Mi lets you charge up to two devices at the same time. ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kfcv6vk0/power-bank/q/z/q/power-bank-10000-plm13zm-mi-original-imafvtreeefx5thb.jpeg?q=70",
  //   },
  //   {
  //     ids: 43,
  //     category: "electronics",
  //     subcategory: "powerbank",
  //     product: "Mi 3i 20000 mAh Power Bank",
  //     price: 2049,
  //     description:
  //       "Don’t let your devices run out of battery while you’re away with this Mi power bank. Thanks to its 18 W fast charge support, this power bank helps you charge your devices quickly and efficiently. It also helps you charge almost all types of devices, such as smartphones, fitness bands and Mi wireless earphones and tablets.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kfcv6vk0/power-bank/r/f/5/power-bank-20000-plm18zm-mi-original-imafvtc7x9zgrzbz.jpeg?q=70",
  //   },
  //   {
  //     ids: 44,
  //     category: "electronics",
  //     subcategory: "powerbank",
  //     product: "Ambrane 10000 mAh Power Bank",
  //     price: 699,
  //     description: "Ambrane Capsule 10k is a 10000 mAh lithium",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/o/l/w/pp-111-10000-ambrane-original-imagg7nprsfvwttp.jpeg?q=70",
  //   },
  //   {
  //     ids: 45,
  //     category: "electronics",
  //     subcategory: "powerbank",
  //     product: "Ambrane 20000 mAh Power Bank",
  //     price: 2499,
  //     description:
  //       "Ambrane PowerLitXL is a 20000 mAh lithium polymer power bank. It comes with 22.5W fast charging output. It is a perfect backup source of power for your mobiles and other gadgets. It features a beautiful elongated shape for aesthetic appeal. ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/k/c/m/powerlit-xl-20000-ambrane-original-imaggusn3dwbfjnz.jpeg?q=70",
  //   },
  //   {
  //     ids: 46,
  //     category: "electronics",
  //     subcategory: "washingmachine",
  //     product: "realme TechLife 5 Star Fully Automatic Washing Machine",
  //     price: 17990,
  //     description:
  //       "The realme TechLife Fully Automatic Front Load Washing Machine lets you simply load your clothes and sit back and enjoy a fantastic washing experience. The Wash Load Sensor in this washer assesses the load and automatically modifies the wash time. Additionally, to prevent agitation, the Auto Imbalance sensor evenly distributes the weight. ",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/e/y/w/-original-imagrepc7dazgcbz.jpeg?q=70",
  //   },
  //   {
  //     ids: 47,
  //     category: "electronics",
  //     subcategory: "washingmachine",
  //     product: "Whirlpool Fully Automatic Washing Machine",
  //     price: 17990,
  //     description:
  //       "You can clean your clothes thoroughly and effectively in the Whirlpool MAGIC CLEAN Pro 7.5 kg Fully Automatic Top-loading Washing Machine. Its six-step heating process can remove up to 50 hard-to-remove stains, like grass, oil, ketchup, and more, all while being gentle on your clothes.",
  //     rating: 4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/i/k/c/-original-imagr83xz9v3v6br.jpeg?q=70",
  //   },
  //   {
  //     ids: 48,
  //     category: "electronics",
  //     subcategory: "washingmachine",
  //     product: "MarQ 5 Star Semi Automatic Washing Machine",
  //     price: 6490,
  //     description:
  //       "The MarQ semi-automatic top-load washing machine (6 kg, 5-star rating) is an extremely durable and highly energy-efficient washing machine engineered for Indian conditions. Enabled with intelligent wash programs ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/ku1k4280/washing-machine-new/r/t/x/mqsa60h5m-marq-by-flipkart-original-imag793fghyygmbg.jpeg?q=70",
  //   },
  //   {
  //     ids: 49,
  //     category: "electronics",
  //     subcategory: "washingmachine",
  //     product: "LG Wind jet dry Semi Automatic Washing Machine ",
  //     price: 11990,
  //     description:
  //       "You can effortlessly wash your clothes with the LG P7020NGAZ 7 kg Washing Machine. With its Rat Away technology, this washing machine boasts a 3 mm thick sturdy plastic base that is coated with a rat repellent chemical that helps prevent damage, increasing its durability and performance. ",
  //     rating: 4.5,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/z/b/g/-original-imagrgqfrpzzpjza.jpeg?q=70",
  //   },
  //   {
  //     ids: 50,
  //     category: "electronics",
  //     subcategory: "washingmachine",
  //     product: "Whirlpool 5 Star Fully Automatic Washing Machine",
  //     price: 14990,
  //     description:
  //       "You can get your clothes completely cleaned even when you have hard-to-remove stains on them with the Whirlpool Magic Clean 7 kg Fully Automatic Top-loading Washing Machine. It comes with a Hard Water Wash feature that detects the type of water being used and adjusts its washing operation accordingly, providing effective cleaning.",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/p/1/g/-original-imagr5pa4shznqyh.jpeg?q=70",
  //   },
  //   {
  //     ids: 51,
  //     category: "mobiles",
  //     subcategory: "apple",
  //     product: "APPLE iPhone 11 (Black, 128 GB)",
  //     price: 42999,
  //     description:
  //       "The iPhone 11 boasts a gorgeous all-screen Liquid Retina LCD that is water resistant up to 2 metres for up to 30 minutes. Moreover, the ultra-wide 13 mm lens has a 120-degree field of view for four times more scenes, and the 26 mm wide lens provides up to 100% Autofocus in low light.",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/k2jbyq80pkrrdj/mobile-refurbished/x/j/s/iphone-11-128-d-mwm02hn-a-apple-0-original-imafkg242ugz8hwc.jpeg?q=70",
  //   },
  //   {
  //     ids: 52,
  //     category: "mobiles",
  //     subcategory: "apple",
  //     product: "APPLE iPhone 12 (Blue, 64 GB)",
  //     price: 53999,
  //     description:
  //       "Dive into a world of crystal-clear visuals with this iPhone’s Super Retina XDR Display. This beast of a smartphone packs the A14 Bionic chip to make for blazing-fast performance speeds. On top of that, its Dual-camera System, along with Night Mode, helps you click amazing pictures and selfies even when the lighting isn’t as good as you’d want it to be.",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/kg8avm80/mobile/y/7/n/apple-iphone-12-dummyapplefsn-original-imafwg8dpyjvgg3j.jpeg?q=70",
  //   },
  //   {
  //     ids: 53,
  //     category: "mobiles",
  //     subcategory: "apple",
  //     product: "APPLE iPhone 13 (Blue, 128 GB)",
  //     price: 58499,
  //     description:
  //       "iPhone 13. boasts an advanced dual-camera system that allows you to click mesmerising pictures with immaculate clarity. Furthermore, the lightning-fast A15 Bionic chip allows for seamless multitasking, elevating your performance to a new dimension.",
  //     rating: 4.7,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/ktketu80/mobile/2/y/o/iphone-13-mlpk3hn-a-apple-original-imag6vpyur6hjngg.jpeg?q=70",
  //   },
  //   {
  //     ids: 54,
  //     category: "mobiles",
  //     subcategory: "apple",
  //     product: "APPLE iPhone 14 (Purple, 128 GB)",
  //     price: 68999,
  //     description:
  //       "The iPhone 14 and iPhone 14 Plus feature a 6.1-inch (15 cm) and 6.7-inch (17 cm) display, improvements to the rear-facing camera, and satellite connectivity for contacting emergency services when a user in trouble is beyond the range of Wi-Fi or cellular networks.",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/u/f/-original-imaghxa5hvapbfds.jpeg?q=70",
  //   },
  //   {
  //     ids: 55,
  //     category: "mobiles",
  //     subcategory: "apple",
  //     product: "APPLE iPhone XR (Yellow, 128 GB)",
  //     price: 41699,
  //     description:
  //       "The iPhone XR is equipped with a new 7-nanometer A12 Bionic chip that's faster and more efficient than the A11 in the previous-generation iPhone X.",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/k0lbdzk0pkrrdj/mobile/y/z/f/apple-iphone-xr-mry72hn-a-original-imafbhywx7zn8ngk.jpeg?q=70",
  //   },
  //   {
  //     ids: 56,
  //     category: "mobiles",
  //     subcategory: "realme",
  //     product: "realme C53 (Champion Gold, 64 GB)",
  //     price: 10999,
  //     description:
  //       "Enjoy a seamless experience with multitude of benefits on this realme C53 smartphone. Take stunning photoshoots with the 108 MP camera and take amazing photos in pixel mode and 3X zoom modes. Sporting a slim 7.99 mm display, you can have an amazing visual interaction with your phone with 90 Hz refresh rates. ",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/h/h/d/-original-imags487gaqqhcea.jpeg?q=70",
  //   },
  //   {
  //     ids: 57,
  //     category: "mobiles",
  //     subcategory: "realme",
  //     product: "realme C55 (Sunshower, 64 GB)",
  //     price: 10999,
  //     description:
  //       "Carry a sophisticated smartphone with you that allows you to multitask effortlessly and continue working no matter how challenging the day appears to be. The 64 MP AI camera of the Realme C55 enables you to snap stunning, high-quality photographs that capture every detail with remarkable clarity. ",
  //     rating: 4.4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/z/x/x/-original-imagp55frhhddu6n.jpeg?q=70",
  //   },
  //   {
  //     ids: 58,
  //     category: "mobiles",
  //     subcategory: "realme",
  //     product: "realme 11 Pro 5G (Oasis Green, 256 GB)",
  //     price: 24999,
  //     description:
  //       "You can enjoy an immersive display on the 120 Hz curved vision display of the realme Pro 5G smartphone. Featuring a 100 MP OIS ProLight camera, this smartphone allows you to capture memories that you can cherish for a lifetime.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/2/z/4/-original-imagqxx2haehpjnf.jpeg?q=70",
  //   },
  //   {
  //     ids: 59,
  //     category: "mobiles",
  //     subcategory: "realme",
  //     product: "realme 10 Pro 5G (Nebula Blue, 128 GB)",
  //     price: 10999,
  //     description:
  //       "Carry the Realme 10 Pro 5G with you wherever you go to catch people's attention. You can enjoy a large screen size with a significantly compact frame thanks to the 17.06 cm (6.72) screen and 93.76% screen-to-body ratio, and the 120 Hz refresh rate provides you with a fantastic user experience.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/y/z/r/-original-imagkp8yzvqffyhc.jpeg?q=70",
  //   },
  //   {
  //     ids: 60,
  //     category: "mobiles",
  //     subcategory: "realme",
  //     product: "realme Narzo N53 (Feather Black, 128 GB)",
  //     price: 12370,
  //     description:
  //       "realme Narzo N53 is powered by the Unisoc T612. It is an octa-core processor with 1x 2.84GHz Cortex-A78 core, 3x 2.42GHz Cortex-A78, 4x 1.8GHz Cortex-A55 that uses 64 bit architecture and Mali-G57 GPU.",
  //     rating: 4.6,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/0/n/r/narzo-n53-rmx3761-realme-original-imagpygzxcuysz9k.jpeg?q=70",
  //   },
  //   {
  //     ids: 61,
  //     category: "mobiles",
  //     subcategory: "oppo",
  //     product: "OPPO Reno10 5G (Ice Blue, 256 GB)",
  //     price: 23999,
  //     description:
  //       "Explore a range of new features on this Oppo Reno 10 5G smartphone. Capture interesting snaps with the ultra clear Portrait camera. This phone has a 64 MP main camera, 32 MP Telephoto camera, 32 MP selfie camera and a 112 degree wide-angle camera. ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/6/l/2/-original-imagrn6dfyqhz3gg.jpeg?q=70",
  //   },
  //   {
  //     ids: 62,
  //     category: "mobiles",
  //     subcategory: "oppo",
  //     product: "OPPO A17 (Lake Blue, 64 GB)",
  //     price: 23999,
  //     description:
  //       "Refresh Rate: 60 Hz, Screen-to-Body Ratio: 89.8%, Color Saturation: 96% NTSC, Aspect Ratio: 20.15:9, Color Gamut: Vivid Mode: 96% NTSC | 100% DCI-P3, Gentle Mode: 72% NTSC | 100% sRGB, Contrast Ratio: 1500:1, Sunshine Screen: Screen Brightness Will Increase Under Sunlight, Brightness: 480 nits/600 nits (Under Sunlight)",
  //     rating: 4.3,
  //     image: "OPPO A17 (Lake Blue, 64 GB)",
  //   },
  //   {
  //     ids: 63,
  //     category: "mobiles",
  //     subcategory: "oppo",
  //     product: "OPPO F21s Pro (Dawnlight Gold, 128 GB)",
  //     price: 21999,
  //     description:
  //       "With an amazing FHD+ AMOLED display, this phone takes it easy on your eyes where you can enjoy a spectrum of vibrant colours without having to worry about protecting your eyes.",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/9/7/-original-imagrxbuvyjxa9vb.jpeg?q=70",
  //   },
  //   {
  //     ids: 64,
  //     category: "mobiles",
  //     subcategory: "oppo",
  //     product: "OPPO A77s (Sunset Orange, 128 GB)",
  //     price: 16499,
  //     description:
  //       "Refresh Rate: 90 Hz (Optional 60 Hz), Screen-to-Body Ratio: 89.8%, Color Saturation: 96%, Aspect Ratio: 20.15:9, Color Gamut: Vivid Mode: 96% NTSC, 100% DCI-P3 Natural Mode: 72% NTSC, 100% SRGB, Contrast Ratio: 1500:1, Supports Sunshine Screen, Brightness: 480 nit (Typical)/600 nit (Sunlight)",
  //     rating: 4.3,
  //     image: "OPPO A77s (Sunset Orange, 128 GB) ",
  //   },
  //   {
  //     ids: 65,
  //     category: "mobiles",
  //     subcategory: "oppo",
  //     product: "OPPO A78 5G (Glowing Blue, 128 GB) ",
  //     price: 18999,
  //     description:
  //       "The Oppo A78 5G smartphone brings to you a horde of innovative traits. Powered with a 33 W SUPERVOOC charger and a 5000 mAh battery capacity, you can travel anywhere without the need to worry about recharging your phone.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/i/s/p/a78-5g-cph2495-oppo-original-imagrwbz6mqddemh.jpeg?q=70",
  //   },
  //   {
  //     ids: 66,
  //     category: "mobiles",
  //     subcategory: "samsung",
  //     product: "SAMSUNG Galaxy F13 (Nightsky Green, 64 GB)",
  //     price: 9499,
  //     description:
  //       "Enjoy seamless connectivity and an uninterrupted movie marathon with the impressive Samsung Galaxy F13 that is designed specifically to impress the entertainment fanatics. This smartphone features a terrific 16.62 cm (6.6) FHD+ LCD Display that can effortlessly blow your mind with its incredible performance. ",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/i/v/-original-imagfhu6bdzhnmkz.jpeg?q=70",
  //   },
  //   {
  //     ids: 67,
  //     category: "mobiles",
  //     subcategory: "samsung",
  //     product: "SAMSUNG Galaxy F54 5G (Stardust Silver, 256 GB)",
  //     price: 29999,
  //     description:
  //       "Packed with a myriad of exciting, innovative features, this Samsung Galaxy F54 smartphone is a revolutionary piece of technology. Rise up to your expectations and level up your excitement as this phone is sure to impress you in all its glory. ",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/q/t/h/galaxy-f54-5g-sm-e546bzshins-samsung-original-imagq79f82pfyzvh.jpeg?q=70",
  //   },
  //   {
  //     ids: 68,
  //     category: "mobiles",
  //     subcategory: "samsung",
  //     product: "SAMSUNG Galaxy F04 (Opal Green, 64 GB)",
  //     price: 8390,
  //     description:
  //       "With the stunning features of the Samsung Galaxy F04 smartphone, discover what it means to have a flawless user experience. This smartphone's astonishing 8 GB of RAM makes multitasking a snap. Additionally, the unique RAM Plus technology intelligently enhances your memory by using your storage as virtual memory, enabling you to conveniently play graphically demanding games",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/w/d/o/-original-imaghgbyhy6banxv.jpeg?q=70",
  //   },
  //   {
  //     ids: 69,
  //     category: "mobiles",
  //     subcategory: "samsung",
  //     product: "SAMSUNG Galaxy F14 5G (GOAT Green, 128 GB)",
  //     price: 13990,
  //     description:
  //       "The Samsung Galaxy F14 smartphone uses a segment-only 5nm processor that enables you with easy multitasking, gaming, and much more. It has a 6000 mAh battery that will last you for up to 2 days on a single charge. Thanks to the 5G connectivity, you can enjoy high speed browsing on this smartphone. It has a large display of about 16.72 cm (6.5) full HD+ display that enables you with immersive viewing.",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/i/k/galaxy-f14-5g-sm-e146bzggins-samsung-original-imagnzdkprfwj9hv.jpeg?q=70",
  //   },
  //   {
  //     ids: 70,
  //     category: "mobiles",
  //     subcategory: "samsung",
  //     product: "SAMSUNG Galaxy F14 5G (GOAT Green, 128 GB)",
  //     price: 12990,
  //     description:
  //       "The Samsung Galaxy F14 smartphone uses a segment-only 5nm processor that enables you with easy multitasking, gaming, and much more. It has a 6000 mAh battery that will last you for up to 2 days on a single charge.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/i/k/galaxy-f14-5g-sm-e146bzggins-samsung-original-imagnzdkprfwj9hv.jpeg?q=70",
  //   },
  //   {
  //     ids: 71,
  //     category: "mobiles",
  //     subcategory: "redmi",
  //     product: "REDMI 11 Prime (Playful Green, 64 GB)",
  //     price: 8999,
  //     description:
  //       "Experience the power of MediaTek Helio G99 processor to seamlessly switch between the apps and multitask easily on the Redmi Prime 11 smartphone. You can enjoy a smooth and fast display, thanks to its 90 Hz FHD+ display.",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/p/m/11-prime-mzb0cepin-redmi-original-imagzqvrhmzjeedx.jpeg?q=70",
  //   },
  //   {
  //     ids: 72,
  //     category: "mobiles",
  //     subcategory: "redmi",
  //     product: "REDMI A2 (Sea Green, 64 GB)",
  //     price: 7600,
  //     description:
  //       "The large and crystal clear 6.52 HD+ display will instantly give you a more stunning visual experience when watching movies and gaming.",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/g/t/a2-mobzc1pin-redmi-original-imagpvyagktrdava.jpeg?q=70",
  //   },
  //   {
  //     ids: 73,
  //     category: "mobiles",
  //     subcategory: "redmi",
  //     product: "REDMI A1+ (Black, 32 GB)",
  //     price: 6599,
  //     description:
  //       "The innovative Redmi A1+ smartphone provides an amazing user experience. Enjoy stunning graphics and enjoy flawless operation. This phone includes a large HD+ display that supports both light and dark modes, a touch sampling rate of 120 Hz, and a display brightness of 400 nits. ",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/p/a/4/-original-imagjyhymqnhz7fm.jpeg?q=70",
  //   },
  //   {
  //     ids: 74,
  //     category: "mobiles",
  //     subcategory: "redmi",
  //     product: "REDMI 12C (Matte Black, 128 GB)",
  //     price: 9799,
  //     description:
  //       "Redmi 12 C is the perfect daily driver that delivers more in the budget smartphone segment with high performing Mediatek Helio G85, making it the fastest smartphone amoung the smartphones launched in 2023 under 10K.",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/m/x/12c-22120rn86i-redmi-original-imagr72bkjec4hjy.jpeg?q=70",
  //   },
  //   {
  //     ids: 75,
  //     category: "mobiles",
  //     subcategory: "redmi",
  //     product: "REDMI 10 (Sunrise Orange, 64 GB)",
  //     price: 9999,
  //     description:
  //       "120Hz Touch Sampling Rate, Screen-to-Body Ratio: 90.5%, NTSC Colour Gamut Coverage: 70%, Aspect Ratio: 20.6:9, Contrast Ratio: 1500:1, Brightness: 400nits",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/c/s/-original-imagndzzsrf3r9g8.jpeg?q=70",
  //   },
  //   {
  //     ids: 76,
  //     category: "accessories",
  //     subcategory: "shoes",
  //     product: "RED TAPE Sneaker Casual Shoes for Men",
  //     price: 1724,
  //     description:
  //       "Sneaker Casual Shoes for Men | Soft Cushioned Insole, Slip-Resistance Sneakers For Men  (Grey)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/416/416/xif0q/shoe/z/n/w/9-rso2773-9-red-tape-grey-original-imagqqyymghpztbk.jpeg?q=70",
  //   },
  //   {
  //     ids: 77,
  //     category: "accessories",
  //     subcategory: "shoes",
  //     product: "RED TAPE Sneaker Casual Shoes",
  //     price: 1349,
  //     description:
  //       "Sneaker Casual Shoes For Men | Soft Cushion Insole, Slip-Resistance Sneakers For Men  (White)",
  //     rating: 4.4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/e/c/o/8-rsl002-red-tape-white-grey-original-imagqxvkvbbfz4jk.jpeg?q=70",
  //   },
  //   {
  //     ids: 78,
  //     category: "accessories",
  //     subcategory: "shoes",
  //     product: "WOODLAND Casuals For Men",
  //     price: 2391,
  //     description: "WOODLAND Casuals For Men  (Khaki)",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/kg9qbgw0-0/shoe/8/l/n/gc-1869115-39-woodland-khaki-original-imafwjfsn9re9kfg.jpeg?q=70",
  //   },
  //   {
  //     ids: 79,
  //     category: "accessories",
  //     subcategory: "shoes",
  //     product: "U.S. POLO ASSN. CLARKIN Sneakers For Men",
  //     price: 1349,
  //     description: "U.S. POLO ASSN. CLARKIN Sneakers For Men  (Grey)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/m/s/h/10-2fd20337g-10-u-s-polo-assn-grey-original-imags6adrjsfwnrg.jpeg?q=70",
  //   },
  //   {
  //     ids: 80,
  //     category: "accessories",
  //     subcategory: "shoes",
  //     product: "K- FOOTLANCE Casuals For Men",
  //     price: 429,
  //     description: "K- FOOTLANCE Casuals For Men  (Blue)",
  //     rating: 3.8,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/t/n/o/10-kc043-blu-k-footlance-blue-original-imag5ffhftjgga9s-bb.jpeg?q=70",
  //   },
  //   {
  //     ids: 81,
  //     category: "accessories",
  //     subcategory: "backpacks",
  //     product: "WESLEY Large 45 L Laptop Backpack",
  //     price: 699,
  //     description:
  //       "Large 45 L Laptop Backpack Unisex Travel hiking laptop bag fits upto 17.3 inch with Raincover and internal organiser backpack Rucksack College bag  (Grey, Blue)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/f/i/r/-original-imagh3w8zghgs7ev.jpeg?q=70",
  //   },
  //   {
  //     ids: 82,
  //     category: "accessories",
  //     subcategory: "backpacks",
  //     product: "PROVOGUE Large 40 L Laptop Backpack",
  //     price: 986,
  //     description:
  //       "Large 40 L Laptop Backpack unisex backpack with rain cover and reflective strip  (Green)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/kgv5x8w0/backpack/e/f/g/unisex-backpack-with-rain-cover-and-reflective-strip-p-039-original-imafxy82qrqxvbvm.jpeg?q=70",
  //   },
  //   {
  //     ids: 83,
  //     category: "accessories",
  //     subcategory: "backpacks",
  //     product: "SAFARI Medium 26 L Laptop Backpack",
  //     price: 769,
  //     description: "Medium 26 L Laptop Backpack Acheiver  (Blue)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/i/i/j/-original-imags4a79zt4xku9.jpeg?q=70",
  //   },
  //   {
  //     ids: 84,
  //     category: "accessories",
  //     subcategory: "backpacks",
  //     product: "PROVOGUE Large 35 L Laptop Backpack",
  //     price: 649,
  //     description:
  //       "Large 35 L Laptop Backpack Spacy unisex backpack with rain cover and reflective strip  (Blue)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/kddf6a80/backpack/f/g/g/spacy-unisex-backpack-with-rain-cover-and-reflective-strip-004-original-imafua3eku3uzywy.jpeg?q=70",
  //   },
  //   {
  //     ids: 85,
  //     category: "accessories",
  //     subcategory: "backpacks",
  //     product: "WROGN Large 35 L Laptop Backpack",
  //     price: 455,
  //     description:
  //       "Large 35 L Laptop Backpack SQAURISH PATACHES LAPTOP BAGPACK  (Green)",
  //     rating: 3.7,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/e/x/6/sqaurish-pataches-laptop-bagpack-square-pattern-laptop-backpack-original-imagpchfpywbunsg.jpeg?q=70",
  //   },
  //   {
  //     ids: 86,
  //     category: "accessories",
  //     subcategory: "wallets",
  //     product: "napa hide Men Tan Genuine Leather RFID Wallet ",
  //     price: 299,
  //     description:
  //       "Men Tan Genuine Leather RFID Wallet - Regular Size  (8 Card Slots)",
  //     rating: 3.9,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/k6b2snk0/wallet-card-wallet/r/h/w/protected-100-genuine-high-quality-mens-crunch-leather-wallet-original-imafzsxt57bzzegu.jpeg?q=70",
  //   },
  //   {
  //     ids: 87,
  //     category: "accessories",
  //     subcategory: "wallets",
  //     product: "Hammonds Flycatcher Men Brown Genuine Leather RFID Wallet",
  //     price: 473,
  //     description:
  //       "Men Brown Genuine Leather RFID Wallet - Mini  (5 Card Slots)",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/j/k/x/rfid-protected-redwood-brown-nappa-leather-wallet-for-men-1-2-original-imagkdg6eqqparvh.jpeg?q=70",
  //   },
  //   {
  //     ids: 88,
  //     category: "accessories",
  //     subcategory: "wallets",
  //     product: "WILDHORN Men Casual Black Genuine Leather Wallet",
  //     price: 479,
  //     description: "Men Casual Black Genuine Leather Wallet  (9 Card Slots)",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/e/c/n/rfid-protected-100-genuine-high-quality-mens-leather-wallet-original-imagm3hugwwzy65g.jpeg?q=70",
  //   },
  //   {
  //     ids: 89,
  //     category: "accessories",
  //     subcategory: "wallets",
  //     product: "FREAKS Men Brown Artificial Leather Wallet",
  //     price: 140,
  //     description: "Men Brown Artificial Leather Wallet - Mini  (3 Card Slots)",
  //     rating: 3.7,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/k3ahbww0/wallet-card-wallet/p/j/w/preet-brown-bmmww-wallet-for-men-preet-brown-bmwmw-wallet-for-original-imafgxappxaczjxy.jpeg?q=70",
  //   },
  //   {
  //     ids: 90,
  //     category: "accessories",
  //     subcategory: "wallets",
  //     product: "Gino Johnson Men Blue Genuine Leather Wallet",
  //     price: 455,
  //     description: "Men Blue Genuine Leather Wallet  (4 Card Slots)",
  //     rating: 3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/r/h/e/blured1-1-10-c1-4-wallet-gino-johnson-8-original-imagr6x7tj7raddb.jpeg?q=70",
  //   },
  //   {
  //     ids: 91,
  //     category: "accessories",
  //     subcategory: "sunglasses",
  //     product: "VINCENT CHASE Polarized, UV Protection Round Sunglasses",
  //     price: 883,
  //     description:
  //       "Polarized, UV Protection Round Sunglasses (50)  (For Men & Women, Green)",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/kvgzyq80/sunglass/j/0/f/149045-m-vincent-chase-original-imag8d97anmzwd5s.jpeg?q=70",
  //   },
  //   {
  //     ids: 92,
  //     category: "accessories",
  //     subcategory: "sunglasses",
  //     product: "VINCENT CHASE UV Protection Wayfarer Sunglasses",
  //     price: 569,
  //     description:
  //       "UV Protection Wayfarer Sunglasses (59)  (For Men & Women, Green)",
  //     rating: 4.2,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/l13whow0/sunglass/z/h/t/151516-59-vincent-chase-original-imagcryhrn7jdwrs.jpeg?q=70",
  //   },
  //   {
  //     ids: 93,
  //     category: "accessories",
  //     subcategory: "sunglasses",
  //     product: "PIRASO UV Protection Clubmaster Sunglasses",
  //     price: 245,
  //     description: "UV Protection Clubmaster Sunglasses (54)  (For Men, Black)",
  //     rating: 3.9,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/sunglass/7/m/m/m-6090-single-sheet-black-piraso-original-imagkfkfpezkgrhx.jpeg?q=70",
  //   },
  //   {
  //     ids: 94,
  //     category: "accessories",
  //     subcategory: "sunglasses",
  //     product: "VINCENT CHASE Polarized, UV Protection Round Sunglasses",
  //     price: 883,
  //     description:
  //       "Polarized, UV Protection Round Sunglasses (50)  (For Men & Women, Green)",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/kvgzyq80/sunglass/j/0/f/149045-m-vincent-chase-original-imag8d97anmzwd5s.jpeg?q=70",
  //   },
  //   {
  //     ids: 95,
  //     category: "accessories",
  //     subcategory: "sunglasses",
  //     product: "Optimity Mirrored Rectangular Sunglasses",
  //     price: 679,
  //     description:
  //       "Mirrored, Night Vision, UV Protection Rectangular Sunglasses (Free Size)  (For Men & Women, Black)",
  //     rating: 4.1,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/sunglass/h/x/7/58-4413-bowix-original-imaghztukzbezbze.jpeg?q=70",
  //   },
  //   {
  //     ids: 96,
  //     category: "accessories",
  //     subcategory: "watch",
  //     product: "Sonata Analog Watch",
  //     price: 435,
  //     description: "Sonata Volt 3.0 Analog Watch - For Men NP77085PP09W",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/b/l/b/-original-imagnydrzykaghd9.jpeg?q=70",
  //   },
  //   {
  //     ids: 97,
  //     category: "accessories",
  //     subcategory: "watch",
  //     product: "Sonata Analog Watch",
  //     price: 539,
  //     description: "Analog Watch - For Men 7142SL03",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/h/m/e/-original-imagrgwwvjfd5ybd.jpeg?q=70",
  //   },
  //   {
  //     ids: 98,
  //     category: "accessories",
  //     subcategory: "watch",
  //     product: "Allen Solly Analog Watch",
  //     price: 1022,
  //     description: "Analog Watch - For Men AS000010E",
  //     rating: 4.3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/m/k/w/-original-imagrcjhxzmmgedc.jpeg?q=70",
  //   },
  //   {
  //     ids: 99,
  //     category: "accessories",
  //     subcategory: "watch",
  //     product: "GUESS Analog Watch",
  //     price: 6998,
  //     description: "Black Dial Analog Watch - For Men GW0446G2",
  //     rating: 4.4,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/b/h/q/-original-imagp9yytz7v2sjt.jpeg?q=70",
  //   },
  //   {
  //     ids: 100,
  //     category: "accessories",
  //     subcategory: "watch",
  //     product: "ANALOGUE Analog Watch",
  //     price: 245,
  //     description:
  //       "All Matte Grey Elegant Series with Water Resistant & 1 Year Quartz Machinery Warranty Analog Watch - For Boys ANLG-428-GREY-GREY",
  //     rating: 3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/r/a/h/-original-imagpzzjeymdfvye.jpeg?q=70",
  //   },
  //   {
  //     ids: 101,
  //     category: "women",
  //     subcategory: "tshirt",
  //     product: "ANALOGUE Analog Watch",
  //     price: 245,
  //     description:
  //       "All Matte Grey Elegant Series with Water Resistant & 1 Year Quartz Machinery Warranty Analog Watch - For Boys ANLG-428-GREY-GREY",
  //     rating: 3,
  //     image:
  //       "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/r/a/h/-original-imagpzzjeymdfvye.jpeg?q=70",
  //   },
  // ]);
  const data = await Product.find();
  // console.log(data);
  res.send(data);
};

const addData = (req, res) => {
  const data = [
    {
      ids: 1,
      category: "men",
      subcategory: "tshirt",
      product: "Relaxed Fit Printed T-shirt",
      price: 799.0,
      description:
        "Relaxed-fit T-shirt in soft cotton jersey with a print motif. Rib-trimmed neckline, dropped shoulders and a straight-cut hem.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fc5%2Fc8%2Fc5c8d473707746ea69fdaf65d8ed728230727b1a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 2,
      category: "men",
      subcategory: "tshirt",
      product: "Relaxed Fit Printed T-shirt",
      price: 799.0,
      description:
        "Relaxed-fit T-shirt in soft cotton jersey with a print motif, round, rib-trimmed neckline, dropped shoulders and a straight-cut hem.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F5d%2Fe7%2F5de7dd7cbd8b56d0e75340665570aacfdfea43b8.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 3,
      category: "men",
      subcategory: "tshirt",
      product: "Relaxed Fit Sweatshirt",
      price: 799.0,
      description:
        "Top in sweatshirt fabric made from a cotton blend. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem. Soft brushed inside.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F83%2F01%2F8301f22eab3b69d612404f26750728949010c3c3.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 4,
      category: "men",
      subcategory: "tshirt",
      product: "Relaxed Fit Printed T-shirt",
      price: 559.0,
      description:
        "Relaxed-fit T-shirt in soft cotton jersey with a print motif. Rib-trimmed neckline, dropped shoulders.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fb9%2Ff0%2Fb9f06e5ae419ea95569ba1b90ea8807042378dfb.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 5,
      category: "men",
      subcategory: "tshirt",
      product: "Relaxed Fit Sweatshirt",
      price: 2299.0,
      description:
        "Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fb0%2Fe6%2Fb0e612d9477e38d7fb66f79bb79042d4f26dce8c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bmen_hoodiessweatshirts_sweatshirts%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 6,
      category: "men",
      subcategory: "shirt",
      product: "Regular Fit Corduroy shirt",
      price: 1499.0,
      description:
        "Regular-fit shirt in soft cotton corduroy with a turn-down collar, classic front, open chest pocket and yoke at the back. Long sleeves with buttoned cuffs and a sleeve placket with a link button. Rounded hem.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F53%2F86%2F53862fe2d490c137b387773ae32d73f1487ea0a6.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 7,
      category: "men",
      subcategory: "shirt",
      product: "Regular Fit Checked shirt",
      price: 1999.0,
      description:
        "Regularf-fit shirt in a checked, lightly brushed cotton weave with a turn-down collar, French front and yoke at the back. Long sleeves with adjustable buttoning at the cuffs, and a rounded hem.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F9c%2Fa6%2F9ca690284cd21ad5fe0acfa8d1d672476342cd93.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 8,
      category: "men",
      subcategory: "shirt",
      product: "Regular Fit Textured-weave shirt",
      price: 1999.0,
      description:
        "Top in sweatshirt fabric made from a cotton blend with a soft brushed inside. Relaxed fit with dropped shoulders and ribbing around the neckline, cuffs and hem.",
      rating: 2.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Faf%2Fe1%2Fafe1bdce20c1065bd15ff24fd49c248478c8e671.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 9,
      category: "men",
      subcategory: "shirt",
      product: "Twill overshirt",
      price: 2699.0,
      description:
        "Overshirt in twill with a collar, buttons down the front and a yoke at the back. Flap chest pockets with a button, and long sleeves with buttoned cuffs.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F4f%2Fbc%2F4fbce4ae63887ddf5610da8a19623a2593375391.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 10,
      category: "men",
      subcategory: "shirt",
      product: "Regular Fit Short-sleeved shirt",
      price: 999.0,
      description:
        "Regular-fit shirt in a printed cotton weave with a turn-down collar, classic front, short sleeves and a yoke at the back. Open chest pocket and a gently rounded hem.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ff2%2Fc9%2Ff2c9f1ce32e411ae31b8356a0f7fb54314f95f5c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 11,
      category: "men",
      subcategory: "trousers",
      product: "Relaxed Fit Cotton cargo joggers",
      price: 2999.0,
      description:
        "Joggers in cotton twill with covered elastication and a drawstring at the waist. Side pockets, and a back pocket and leg pockets with a flap and press-studs. Covered elastication and a hook and loop tab at the hems.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F60%2F2a%2F602a44c930651379edfb0cb30ca9c62d337fbf2d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 12,
      category: "men",
      subcategory: "trousers",
      product: "Relaxed Fit Cotton cargo joggers",
      price: 2999.0,
      description:
        "Joggers in cotton twill with covered elastication and a drawstring at the waist. Side pockets, and a back pocket and leg pockets with a flap and press-studs. Covered elastication and a hook and loop tab at the hems.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F6b%2F28%2F6b28dd1c9e78ea180ec8c8dfb4322b1ce09c54af.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 13,
      category: "men",
      subcategory: "trousers",
      product: "Relaxed Denim Joggers",
      price: 2299.0,
      description:
        "Joggers in rigid cotton denim with a straight leg and a regular fit from the waist to the hem with a comfortable, looser feel around the whole leg. Regular waist with covered elastication and a drawstring, a fake fly, pockets in the side seams and an open back pocket. Covered elastication at the hems.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fc7%2F3b%2Fc73b505dc1b01608f7e8cf939baa1d60426e6088.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 14,
      category: "men",
      subcategory: "trousers",
      product: "Regular Fit Sweatpants",
      price: 1499.0,
      description:
        "Regular-fit sweatpants in sweatshirt fabric made from a cotton blend. Covered elastication and a drawstring at the waist, pockets in the side seams and ribbed hems. Soft brushed inside.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F7b%2F39%2F7b3977bd0958b6ab93bb07e7f6dcce7cb635760c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 15,
      category: "men",
      subcategory: "trousers",
      product: "Loose Denim Joggers",
      price: 2299.0,
      description:
        "Joggers in sturdy cotton denim with a rounded leg and a loose fit from the seat to the hem with a dropped crotch and extra room around the whole leg. Regular waist with covered elastication and a concealed drawstring. Side pockets, open back pockets and a fake fly. All you need to conquer the full denim look.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F7e%2F93%2F7e9393be7ac88ae2ff57801ab748be069466e0fb.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 16,
      category: "men",
      subcategory: "jackets",
      product: "Imitation leather jacket",
      price: 5499.0,
      description:
        "Jacket in soft imitation leather with a collar, zip down the front and buttoned cuffs. Two inner pockets, and diagonal side pockets with a concealed press-stud. Lined.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fc3%2F15%2Fc315fa517f75e69b5e54217dba423202dbb41017.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 17,
      category: "men",
      subcategory: "jackets",
      product: "Padded lightweight gilet",
      price: 2299.0,
      description:
        "Padded gilet in quilted nylon with a hood, zip down the front with a chin guard and discreet zipped pockets in the side seams. Elasticated trim around the hood, armholes and hem. Lined.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F02%2F9b%2F029b95bcf2e8c1a5d43741d5f5b7f264566d518a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 18,
      category: "men",
      subcategory: "jackets",
      product: "Regular Fit Windbreaker",
      price: 2699.0,
      description:
        "Regular-fit windbreaker in windproof, water-repellent nylon. Lined hood with an elasticated drawstring, a zip down the front and long sleeves with covered elastication at the cuffs. Zipped side pockets and an inner pocket with a press-stud. Concealed, elasticated drawstring at the hem. Lined.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ffb%2F09%2Ffb099c38d85c7010250a9801384721087076cd56.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 19,
      category: "men",
      subcategory: "jackets",
      product: "Regular Fit Baseball jacket",
      price: 6999.0,
      description:
        "Disney100 x H&M. In celebration of Disney's 100th anniversary, artist and former professional snowboarder Trevor Andrew has created this streetwear-inspired collection featuring new takes on some of the studio's most beloved characters. This baseball jacket is made from a soft, felted weave with embroidered motifs on the front and back.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F66%2F7d%2F667d41e91b8e8ffebd0f2c4746de0ca95d1c1228.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 20,
      category: "men",
      subcategory: "jackets",
      product: "Baseball jacket",
      price: 2999.0,
      description:
        "Baseball jacket in woven fabric with an embroidered motif on the front. Ribbed stand-up collar, press-studs down the front, long sleeves and wide ribbing at the cuffs and hem. Diagonal jetted pockets at the front and an inner pocket with a press-stud. Lined.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F35%2F34%2F35346fc48c44c09423af5af39cfd790c80073a4e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 21,
      category: "men",
      subcategory: "shorts",
      product: "Printed sweatshirt shorts",
      price: 1999.0,
      description:
        "Knee-length shorts in sweatshirt fabric with a print motif and an elasticated, drawstring waist.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F28%2Fd9%2F28d940fa88a9c924576257d1c7b1ae1f2b7ff649.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 22,
      category: "men",
      subcategory: "shorts",
      product: "Regular Fit Sweatshorts",
      price: 799.0,
      description:
        "Shorts in lightweight sweatshirt fabric made from a cotton blend. Regular fit with an elasticated, drawstring waist, side pockets, an open back pocket and raw, roll-edge hems.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F18%2Fac%2F18acc8a9aa27b55a793d8b9407ae5a5364e94cd0.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 23,
      category: "men",
      subcategory: "shorts",
      product: "Regular Fit Sweatshorts",
      price: 799.0,
      description:
        "Shorts in lightweight sweatshirt fabric made from a cotton blend. Regular fit with an elasticated, drawstring waist, side pockets, an open back pocket and raw, roll-edge hems.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fbe%2F21%2Fbe2183ae86d547e53278942f0d44d271f1559525.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 24,
      category: "men",
      subcategory: "shorts",
      product: "Printed sweatshirt shorts",
      price: 2299.0,
      description:
        "Relaxed-fit, knee-length cargo shorts in nylon with covered elastication and an elasticated drawstring that has a cord stopper at the waist. Fake fly, zipped side pockets, welt back pockets and a bellows pocket with concealed press-studs on each leg, one with a zipped pocket on top.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fca%2Fc9%2Fcac9a88464d81148015c221e95df2a548b37e2ff.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 25,
      category: "men",
      subcategory: "shorts",
      product: "Hybrid Regular Denim shorts",
      price: 2299.0,
      description:
        "5-pocket jogger shorts in stretch denim made from a cotton blend. Regular waist with a concealed drawstring at the front and covered elastication at the back, and a zip fly with a button. Straight legs with good room for movement over the thighs and knees. ",
      rating: 4.5,
      image:
        "hhttps://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ff5%2F64%2Ff5646551d8ea33c6d32089e07d6d57dd26e009de.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 26,
      category: "electronics",
      subcategory: "earphone",
      product: "boAt Rockerz 255 Pro+ /258 Pro+",
      price: 999,
      description:
        "boAt Rockerz 255 Pro+ is a power-packed in-ear wireless neckband headphone that has been ergonomically designed to meet the needs of music lovers. The headphones come equipped with Bluetooth V5.0 for instant wireless connectivity.",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/l31x2fk0/headphone/a/s/h/-original-image9ehehz8amg2.jpeg?q=70",
    },
    {
      ids: 27,
      category: "electronics",
      subcategory: "earphone",
      product: "realme Buds 2 Wired Headset ",
      price: 599,
      description:
        "Hear every soundtrack even more clearly when you use these Realme Buds 2 earphones. They come with the powerful 11.2-mm bass boost driver for elevated bass response. Moreover, these stylishly designed earphones have integrated magnets which offer a hassle-free way of storing them. ",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/k20r8nk0/headphone/7/w/c/realme-buds-2-original-imafhgrckbygsyrk.jpeg?q=70",
    },
    {
      ids: 28,
      category: "electronics",
      subcategory: "earphone",
      product: "Mi Basic Wired Headset with Mic",
      price: 447,
      description:
        "Super Extra Bass, Metal Sound Chamber, Dynamic Bass, HD Clear Sound, Aerospace Grade Metal Diaphragm For a Resonating Bass",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/krntoy80/headphone/j/l/n/ydjc01jy-mi-original-imag5egze7eb9taj.jpeg?q=70",
    },
    {
      ids: 29,
      category: "electronics",
      subcategory: "earphone",
      product: "JBL C150SI",
      price: 747,
      description:
        "You can enjoy the sound of deepened notes with stellar bass response and manage your calls conveniently with the JBL C150SI wired headset. It features a one-button universal remote that helps you operate this headset with ease. ",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/juwzf680/headphone-refurbished/7/h/k/z-c100si-jbl-original-imaffxja5vmgwudz.jpeg?q=70",
    },
    {
      ids: 30,
      category: "electronics",
      subcategory: "earphone",
      product: "SONY EX14AP Wired Headset",
      price: 549,
      description:
        "Enhance your aural experience with this pair of Sony in-the-ear headphones, thanks to its 9 mm Neodymium Drivers and 8 Hz–22 kHz Frequency Range for clear, powerful and balanced sound.In-line Mic for Hands-free Calling",
      rating: 4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kjym9ow0/headphone/headphone/v/s/e/mdr-ex14ap-sony-original-imafzetchwdhn9jx.jpeg?q=70",
    },
    {
      ids: 31,
      category: "electronics",
      subcategory: "airpods",
      product: "Apple AirPods(2nd gen)",
      price: 8999,
      description:
        "The new AirPods combine intelligent design with breakthrough technology and crystal clear sound. Powered by the new Apple H1 headphone chip, AirPods now feature hands-free access to Siri using just your voice. And up to 3 hours of talk time on a single charge.Specifications",
      rating: 4.5,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kpinwy80/headphone/x/r/e/mmef2hn-a-apple-original-imag3qe9hphsevrt.jpeg?q=70",
    },
    {
      ids: 32,
      category: "electronics",
      subcategory: "airpods",
      product: "APPLE AirPods (3rd generation) ",
      price: 16990,
      description:
        "Introducing the all-new AirPods. Featuring spatial audio that places sound all around you, Adaptive EQ that tunes music to your ears, and longer battery life. It�s all sweat and water resistant and delivers an experience that�s simply magical.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kwdv3bk0/headphone/q/o/x/-original-imag92pgct73fbvx.jpeg?q=70",
    },
    {
      ids: 33,
      category: "electronics",
      subcategory: "airpods",
      product: "Mestie Bluetooth Earphones I12 TWS ",
      price: 423,
      description:
        "True wireless Bluetooth earphones Charging Case + Super Mini is a wireless charging to use the whole day without any irritation. It is specially designed for your soft ears with the latest and new model for a complete solution for your all worries while you are in the gym, driving, or running. Use Headset to make your life stress less.",
      rating: 3.4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/n/s/y/bluetooth-earphones-i12-tws-with-in-built-mic-bluetooth-headset-original-imagqctvfad6gb9k.jpeg?q=70",
    },
    {
      ids: 34,
      category: "electronics",
      subcategory: "airpods",
      product: "Noise Buds VS102",
      price: 999,
      description:
        "You can enjoy up to 50 hours of music, movies, or binge watch all night long with these Noise Buds VS102 earbuds. In addition to its excellent audio quality it has a stunning flybird design which makes it trendy. With its quick charging feature, you can enjoy your favourite content all day long.",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/d/q/r/-original-imagp6skt77zsdjt.jpeg?q=70",
    },
    {
      ids: 35,
      category: "electronics",
      subcategory: "airpods",
      product: "Noise Buds VS102",
      price: 899,
      description:
        "You can enjoy up to 50 hours of music, movies, or binge watch all night long with these Noise Buds VS102 earbuds. In addition to its excellent audio quality it has a stunning flybird design which makes it trendy. With its quick charging feature, you can enjoy your favourite content all day long. ",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/p/0/p/-original-imagp6skfbnypq5g.jpeg?q=70",
    },
    {
      ids: 36,
      category: "electronics",
      subcategory: "Tv",
      product: "OnePlus Y1S 32 inch LED Smart Android TV",
      price: 12499,
      description:
        "You can watch your favourite movies, shows, and other content on this OnePlus TV. Sporting a slim bezel-less design, this TV is designed to offer an enhanced viewing experience. Powered by an AI-driven Gamma Engine, this TV provides lifelike visuals with brilliant colours.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kzfvzww0/television/e/b/b/32hd2a00-32-y1s-oneplus-original-imagbgcewfqywgk7.jpeg?q=70",
    },
    {
      ids: 37,
      category: "electronics",
      subcategory: "Tv",
      product: "realme32 inch Ready LED Smart Android TV",
      price: 11999,
      description:
        "Bring home this TV from realme and experience the stunning visuals that result from its Chroma Boost Picture Engine. Boasting a Bezel-less design and Dolby Surround Audio, this Android TV blends right into your decor",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/television/h/a/r/-original-imaghgphdj9fsvzt.jpeg?q=70",
    },
    {
      ids: 38,
      category: "electronics",
      subcategory: "Tv",
      product: "LG UQ7500 43 inch Ultra (4K) LED Smart WebOS TV",
      price: 28990,
      description:
        "Get larger than life visuals and unmatched movie watching experience on the LG UHD TV. This TV comes with a UHD 4K resolution display so that you can get a true-to-life visual quality and vivid colours. and streaming services with the With pre-installed streaming services on this TV, you can conveniently browse through your preferred content throughout the day.",
      rating: 4.4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/television/n/h/y/-original-imagg24zpbk2h7tx.jpeg?q=70",
    },
    {
      ids: 39,
      category: "electronics",
      subcategory: "Tv",
      product: "Mi X Series 43 inch Ultra HD (4K) LED Smart Google TV",
      price: 28999,
      description:
        "he Xiaomi X Series TV presents an unparalleled home entertainment experience with its 4K clarity, bezel-less design, Dolby Vision, Vivid Picture Engine, extensive colour gamut, MEMC Engine Reality Flow, powerful sound, Google TV integration, Patchwall and Patchwall+ access, optimised performance, ",
      rating: 4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/television/g/s/l/l43m8-a2in-xiaomi-original-imagrzmzvmedcpzf.jpeg?q=70",
    },
    {
      ids: 40,
      category: "electronics",
      subcategory: "Tv",
      product:
        "Acer Advanced I Series 43 inch Ultra HD (4K) LED Smart Google TV ",
      price: 23999,
      description:
        "You can bring home the world of entertainment with the Acer Advanced I Series LED Smart Google TV. This Google TV allows you to personalise profiles for every user at home based on your interests. With Dolby Vision you can enjoy crystal clear and detailed visuals on this TV. ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/television/a/2/z/-original-imagqh768aaghnuy.jpeg?q=70",
    },
    {
      ids: 41,
      category: "electronics",
      subcategory: "powerbank",
      product: "Ambrane 10000 mAh Power Bank",
      price: 699,
      description: "Ambrane Capsule 10k is a 10000 mAh lithium",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/o/l/w/pp-111-10000-ambrane-original-imagg7nprsfvwttp.jpeg?q=70",
    },
    {
      ids: 42,
      category: "electronics",
      subcategory: "powerbank",
      product: "Mi 3i 10000 mAh Power Bank",
      price: 1299,
      description:
        "Take this lightweight and stylish powerbank along with you when you’re traveling so that you can always keep your devices juiced up. Featuring two USB output ports, this 10000 mAh powerbank from Mi lets you charge up to two devices at the same time. ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kfcv6vk0/power-bank/q/z/q/power-bank-10000-plm13zm-mi-original-imafvtreeefx5thb.jpeg?q=70",
    },
    {
      ids: 43,
      category: "electronics",
      subcategory: "powerbank",
      product: "Mi 3i 20000 mAh Power Bank",
      price: 2049,
      description:
        "Don’t let your devices run out of battery while you’re away with this Mi power bank. Thanks to its 18 W fast charge support, this power bank helps you charge your devices quickly and efficiently. It also helps you charge almost all types of devices, such as smartphones, fitness bands and Mi wireless earphones and tablets.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kfcv6vk0/power-bank/r/f/5/power-bank-20000-plm18zm-mi-original-imafvtc7x9zgrzbz.jpeg?q=70",
    },
    {
      ids: 44,
      category: "electronics",
      subcategory: "powerbank",
      product: "Ambrane 10000 mAh Power Bank",
      price: 699,
      description: "Ambrane Capsule 10k is a 10000 mAh lithium",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/o/l/w/pp-111-10000-ambrane-original-imagg7nprsfvwttp.jpeg?q=70",
    },
    {
      ids: 45,
      category: "electronics",
      subcategory: "powerbank",
      product: "Ambrane 20000 mAh Power Bank",
      price: 2499,
      description:
        "Ambrane PowerLitXL is a 20000 mAh lithium polymer power bank. It comes with 22.5W fast charging output. It is a perfect backup source of power for your mobiles and other gadgets. It features a beautiful elongated shape for aesthetic appeal. ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/shopsy-power-bank/k/c/m/powerlit-xl-20000-ambrane-original-imaggusn3dwbfjnz.jpeg?q=70",
    },
    {
      ids: 46,
      category: "electronics",
      subcategory: "washingmachine",
      product: "realme TechLife 5 Star Fully Automatic Washing Machine",
      price: 17990,
      description:
        "The realme TechLife Fully Automatic Front Load Washing Machine lets you simply load your clothes and sit back and enjoy a fantastic washing experience. The Wash Load Sensor in this washer assesses the load and automatically modifies the wash time. Additionally, to prevent agitation, the Auto Imbalance sensor evenly distributes the weight. ",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/e/y/w/-original-imagrepc7dazgcbz.jpeg?q=70",
    },
    {
      ids: 47,
      category: "electronics",
      subcategory: "washingmachine",
      product: "Whirlpool Fully Automatic Washing Machine",
      price: 17990,
      description:
        "You can clean your clothes thoroughly and effectively in the Whirlpool MAGIC CLEAN Pro 7.5 kg Fully Automatic Top-loading Washing Machine. Its six-step heating process can remove up to 50 hard-to-remove stains, like grass, oil, ketchup, and more, all while being gentle on your clothes.",
      rating: 4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/i/k/c/-original-imagr83xz9v3v6br.jpeg?q=70",
    },
    {
      ids: 48,
      category: "electronics",
      subcategory: "washingmachine",
      product: "MarQ 5 Star Semi Automatic Washing Machine",
      price: 6490,
      description:
        "The MarQ semi-automatic top-load washing machine (6 kg, 5-star rating) is an extremely durable and highly energy-efficient washing machine engineered for Indian conditions. Enabled with intelligent wash programs ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/ku1k4280/washing-machine-new/r/t/x/mqsa60h5m-marq-by-flipkart-original-imag793fghyygmbg.jpeg?q=70",
    },
    {
      ids: 49,
      category: "electronics",
      subcategory: "washingmachine",
      product: "LG Wind jet dry Semi Automatic Washing Machine ",
      price: 11990,
      description:
        "You can effortlessly wash your clothes with the LG P7020NGAZ 7 kg Washing Machine. With its Rat Away technology, this washing machine boasts a 3 mm thick sturdy plastic base that is coated with a rat repellent chemical that helps prevent damage, increasing its durability and performance. ",
      rating: 4.5,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/z/b/g/-original-imagrgqfrpzzpjza.jpeg?q=70",
    },
    {
      ids: 50,
      category: "electronics",
      subcategory: "washingmachine",
      product: "Whirlpool 5 Star Fully Automatic Washing Machine",
      price: 14990,
      description:
        "You can get your clothes completely cleaned even when you have hard-to-remove stains on them with the Whirlpool Magic Clean 7 kg Fully Automatic Top-loading Washing Machine. It comes with a Hard Water Wash feature that detects the type of water being used and adjusts its washing operation accordingly, providing effective cleaning.",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/p/1/g/-original-imagr5pa4shznqyh.jpeg?q=70",
    },
    {
      ids: 51,
      category: "mobiles",
      subcategory: "apple",
      product: "APPLE iPhone 11 (Black, 128 GB)",
      price: 42999,
      description:
        "The iPhone 11 boasts a gorgeous all-screen Liquid Retina LCD that is water resistant up to 2 metres for up to 30 minutes. Moreover, the ultra-wide 13 mm lens has a 120-degree field of view for four times more scenes, and the 26 mm wide lens provides up to 100% Autofocus in low light.",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/k2jbyq80pkrrdj/mobile-refurbished/x/j/s/iphone-11-128-d-mwm02hn-a-apple-0-original-imafkg242ugz8hwc.jpeg?q=70",
    },
    {
      ids: 52,
      category: "mobiles",
      subcategory: "apple",
      product: "APPLE iPhone 12 (Blue, 64 GB)",
      price: 53999,
      description:
        "Dive into a world of crystal-clear visuals with this iPhone’s Super Retina XDR Display. This beast of a smartphone packs the A14 Bionic chip to make for blazing-fast performance speeds. On top of that, its Dual-camera System, along with Night Mode, helps you click amazing pictures and selfies even when the lighting isn’t as good as you’d want it to be.",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/kg8avm80/mobile/y/7/n/apple-iphone-12-dummyapplefsn-original-imafwg8dpyjvgg3j.jpeg?q=70",
    },
    {
      ids: 53,
      category: "mobiles",
      subcategory: "apple",
      product: "APPLE iPhone 13 (Blue, 128 GB)",
      price: 58499,
      description:
        "iPhone 13. boasts an advanced dual-camera system that allows you to click mesmerising pictures with immaculate clarity. Furthermore, the lightning-fast A15 Bionic chip allows for seamless multitasking, elevating your performance to a new dimension.",
      rating: 4.7,
      image:
        "https://rukminim2.flixcart.com/image/416/416/ktketu80/mobile/2/y/o/iphone-13-mlpk3hn-a-apple-original-imag6vpyur6hjngg.jpeg?q=70",
    },
    {
      ids: 54,
      category: "mobiles",
      subcategory: "apple",
      product: "APPLE iPhone 14 (Purple, 128 GB)",
      price: 68999,
      description:
        "The iPhone 14 and iPhone 14 Plus feature a 6.1-inch (15 cm) and 6.7-inch (17 cm) display, improvements to the rear-facing camera, and satellite connectivity for contacting emergency services when a user in trouble is beyond the range of Wi-Fi or cellular networks.",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/u/f/-original-imaghxa5hvapbfds.jpeg?q=70",
    },
    {
      ids: 55,
      category: "mobiles",
      subcategory: "apple",
      product: "APPLE iPhone XR (Yellow, 128 GB)",
      price: 41699,
      description:
        "The iPhone XR is equipped with a new 7-nanometer A12 Bionic chip that's faster and more efficient than the A11 in the previous-generation iPhone X.",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/k0lbdzk0pkrrdj/mobile/y/z/f/apple-iphone-xr-mry72hn-a-original-imafbhywx7zn8ngk.jpeg?q=70",
    },
    {
      ids: 56,
      category: "mobiles",
      subcategory: "realme",
      product: "realme C53 (Champion Gold, 64 GB)",
      price: 10999,
      description:
        "Enjoy a seamless experience with multitude of benefits on this realme C53 smartphone. Take stunning photoshoots with the 108 MP camera and take amazing photos in pixel mode and 3X zoom modes. Sporting a slim 7.99 mm display, you can have an amazing visual interaction with your phone with 90 Hz refresh rates. ",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/h/h/d/-original-imags487gaqqhcea.jpeg?q=70",
    },
    {
      ids: 57,
      category: "mobiles",
      subcategory: "realme",
      product: "realme C55 (Sunshower, 64 GB)",
      price: 10999,
      description:
        "Carry a sophisticated smartphone with you that allows you to multitask effortlessly and continue working no matter how challenging the day appears to be. The 64 MP AI camera of the Realme C55 enables you to snap stunning, high-quality photographs that capture every detail with remarkable clarity. ",
      rating: 4.4,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/z/x/x/-original-imagp55frhhddu6n.jpeg?q=70",
    },
    {
      ids: 58,
      category: "mobiles",
      subcategory: "realme",
      product: "realme 11 Pro 5G (Oasis Green, 256 GB)",
      price: 24999,
      description:
        "You can enjoy an immersive display on the 120 Hz curved vision display of the realme Pro 5G smartphone. Featuring a 100 MP OIS ProLight camera, this smartphone allows you to capture memories that you can cherish for a lifetime.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/2/z/4/-original-imagqxx2haehpjnf.jpeg?q=70",
    },
    {
      ids: 59,
      category: "mobiles",
      subcategory: "realme",
      product: "realme 10 Pro 5G (Nebula Blue, 128 GB)",
      price: 10999,
      description:
        "Carry the Realme 10 Pro 5G with you wherever you go to catch people's attention. You can enjoy a large screen size with a significantly compact frame thanks to the 17.06 cm (6.72) screen and 93.76% screen-to-body ratio, and the 120 Hz refresh rate provides you with a fantastic user experience.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/y/z/r/-original-imagkp8yzvqffyhc.jpeg?q=70",
    },
    {
      ids: 60,
      category: "mobiles",
      subcategory: "realme",
      product: "realme Narzo N53 (Feather Black, 128 GB)",
      price: 12370,
      description:
        "realme Narzo N53 is powered by the Unisoc T612. It is an octa-core processor with 1x 2.84GHz Cortex-A78 core, 3x 2.42GHz Cortex-A78, 4x 1.8GHz Cortex-A55 that uses 64 bit architecture and Mali-G57 GPU.",
      rating: 4.6,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/0/n/r/narzo-n53-rmx3761-realme-original-imagpygzxcuysz9k.jpeg?q=70",
    },
    {
      ids: 61,
      category: "mobiles",
      subcategory: "oppo",
      product: "OPPO Reno10 5G (Ice Blue, 256 GB)",
      price: 23999,
      description:
        "Explore a range of new features on this Oppo Reno 10 5G smartphone. Capture interesting snaps with the ultra clear Portrait camera. This phone has a 64 MP main camera, 32 MP Telephoto camera, 32 MP selfie camera and a 112 degree wide-angle camera. ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/6/l/2/-original-imagrn6dfyqhz3gg.jpeg?q=70",
    },
    {
      ids: 62,
      category: "mobiles",
      subcategory: "oppo",
      product: "OPPO A17 (Lake Blue, 64 GB)",
      price: 23999,
      description:
        "Refresh Rate: 60 Hz, Screen-to-Body Ratio: 89.8%, Color Saturation: 96% NTSC, Aspect Ratio: 20.15:9, Color Gamut: Vivid Mode: 96% NTSC | 100% DCI-P3, Gentle Mode: 72% NTSC | 100% sRGB, Contrast Ratio: 1500:1, Sunshine Screen: Screen Brightness Will Increase Under Sunlight, Brightness: 480 nits/600 nits (Under Sunlight)",
      rating: 4.3,
      image: "OPPO A17 (Lake Blue, 64 GB)",
    },
    {
      ids: 63,
      category: "mobiles",
      subcategory: "oppo",
      product: "OPPO F21s Pro (Dawnlight Gold, 128 GB)",
      price: 21999,
      description:
        "With an amazing FHD+ AMOLED display, this phone takes it easy on your eyes where you can enjoy a spectrum of vibrant colours without having to worry about protecting your eyes.",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/9/7/-original-imagrxbuvyjxa9vb.jpeg?q=70",
    },
    {
      ids: 64,
      category: "mobiles",
      subcategory: "oppo",
      product: "OPPO A77s (Sunset Orange, 128 GB)",
      price: 16499,
      description:
        "Refresh Rate: 90 Hz (Optional 60 Hz), Screen-to-Body Ratio: 89.8%, Color Saturation: 96%, Aspect Ratio: 20.15:9, Color Gamut: Vivid Mode: 96% NTSC, 100% DCI-P3 Natural Mode: 72% NTSC, 100% SRGB, Contrast Ratio: 1500:1, Supports Sunshine Screen, Brightness: 480 nit (Typical)/600 nit (Sunlight)",
      rating: 4.3,
      image: "OPPO A77s (Sunset Orange, 128 GB) ",
    },
    {
      ids: 65,
      category: "mobiles",
      subcategory: "oppo",
      product: "OPPO A78 5G (Glowing Blue, 128 GB) ",
      price: 18999,
      description:
        "The Oppo A78 5G smartphone brings to you a horde of innovative traits. Powered with a 33 W SUPERVOOC charger and a 5000 mAh battery capacity, you can travel anywhere without the need to worry about recharging your phone.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/i/s/p/a78-5g-cph2495-oppo-original-imagrwbz6mqddemh.jpeg?q=70",
    },
    {
      ids: 66,
      category: "mobiles",
      subcategory: "samsung",
      product: "SAMSUNG Galaxy F13 (Nightsky Green, 64 GB)",
      price: 9499,
      description:
        "Enjoy seamless connectivity and an uninterrupted movie marathon with the impressive Samsung Galaxy F13 that is designed specifically to impress the entertainment fanatics. This smartphone features a terrific 16.62 cm (6.6) FHD+ LCD Display that can effortlessly blow your mind with its incredible performance. ",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/a/i/v/-original-imagfhu6bdzhnmkz.jpeg?q=70",
    },
    {
      ids: 67,
      category: "mobiles",
      subcategory: "samsung",
      product: "SAMSUNG Galaxy F54 5G (Stardust Silver, 256 GB)",
      price: 29999,
      description:
        "Packed with a myriad of exciting, innovative features, this Samsung Galaxy F54 smartphone is a revolutionary piece of technology. Rise up to your expectations and level up your excitement as this phone is sure to impress you in all its glory. ",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/q/t/h/galaxy-f54-5g-sm-e546bzshins-samsung-original-imagq79f82pfyzvh.jpeg?q=70",
    },
    {
      ids: 68,
      category: "mobiles",
      subcategory: "samsung",
      product: "SAMSUNG Galaxy F04 (Opal Green, 64 GB)",
      price: 8390,
      description:
        "With the stunning features of the Samsung Galaxy F04 smartphone, discover what it means to have a flawless user experience. This smartphone's astonishing 8 GB of RAM makes multitasking a snap. Additionally, the unique RAM Plus technology intelligently enhances your memory by using your storage as virtual memory, enabling you to conveniently play graphically demanding games",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/w/d/o/-original-imaghgbyhy6banxv.jpeg?q=70",
    },
    {
      ids: 69,
      category: "mobiles",
      subcategory: "samsung",
      product: "SAMSUNG Galaxy F14 5G (GOAT Green, 128 GB)",
      price: 13990,
      description:
        "The Samsung Galaxy F14 smartphone uses a segment-only 5nm processor that enables you with easy multitasking, gaming, and much more. It has a 6000 mAh battery that will last you for up to 2 days on a single charge. Thanks to the 5G connectivity, you can enjoy high speed browsing on this smartphone. It has a large display of about 16.72 cm (6.5) full HD+ display that enables you with immersive viewing.",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/i/k/galaxy-f14-5g-sm-e146bzggins-samsung-original-imagnzdkprfwj9hv.jpeg?q=70",
    },
    {
      ids: 70,
      category: "mobiles",
      subcategory: "samsung",
      product: "SAMSUNG Galaxy F14 5G (GOAT Green, 128 GB)",
      price: 12990,
      description:
        "The Samsung Galaxy F14 smartphone uses a segment-only 5nm processor that enables you with easy multitasking, gaming, and much more. It has a 6000 mAh battery that will last you for up to 2 days on a single charge.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/j/i/k/galaxy-f14-5g-sm-e146bzggins-samsung-original-imagnzdkprfwj9hv.jpeg?q=70",
    },
    {
      ids: 71,
      category: "mobiles",
      subcategory: "redmi",
      product: "REDMI 11 Prime (Playful Green, 64 GB)",
      price: 8999,
      description:
        "Experience the power of MediaTek Helio G99 processor to seamlessly switch between the apps and multitask easily on the Redmi Prime 11 smartphone. You can enjoy a smooth and fast display, thanks to its 90 Hz FHD+ display.",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/m/p/m/11-prime-mzb0cepin-redmi-original-imagzqvrhmzjeedx.jpeg?q=70",
    },
    {
      ids: 72,
      category: "mobiles",
      subcategory: "redmi",
      product: "REDMI A2 (Sea Green, 64 GB)",
      price: 7600,
      description:
        "The large and crystal clear 6.52 HD+ display will instantly give you a more stunning visual experience when watching movies and gaming.",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/b/g/t/a2-mobzc1pin-redmi-original-imagpvyagktrdava.jpeg?q=70",
    },
    {
      ids: 73,
      category: "mobiles",
      subcategory: "redmi",
      product: "REDMI A1+ (Black, 32 GB)",
      price: 6599,
      description:
        "The innovative Redmi A1+ smartphone provides an amazing user experience. Enjoy stunning graphics and enjoy flawless operation. This phone includes a large HD+ display that supports both light and dark modes, a touch sampling rate of 120 Hz, and a display brightness of 400 nits. ",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/p/a/4/-original-imagjyhymqnhz7fm.jpeg?q=70",
    },
    {
      ids: 74,
      category: "mobiles",
      subcategory: "redmi",
      product: "REDMI 12C (Matte Black, 128 GB)",
      price: 9799,
      description:
        "Redmi 12 C is the perfect daily driver that delivers more in the budget smartphone segment with high performing Mediatek Helio G85, making it the fastest smartphone amoung the smartphones launched in 2023 under 10K.",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/s/m/x/12c-22120rn86i-redmi-original-imagr72bkjec4hjy.jpeg?q=70",
    },
    {
      ids: 75,
      category: "mobiles",
      subcategory: "redmi",
      product: "REDMI 10 (Sunrise Orange, 64 GB)",
      price: 9999,
      description:
        "120Hz Touch Sampling Rate, Screen-to-Body Ratio: 90.5%, NTSC Colour Gamut Coverage: 70%, Aspect Ratio: 20.6:9, Contrast Ratio: 1500:1, Brightness: 400nits",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/n/c/s/-original-imagndzzsrf3r9g8.jpeg?q=70",
    },
    {
      ids: 76,
      category: "accessories",
      subcategory: "shoes",
      product: "RED TAPE Sneaker Casual Shoes for Men",
      price: 1724,
      description:
        "Sneaker Casual Shoes for Men | Soft Cushioned Insole, Slip-Resistance Sneakers For Men  (Grey)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/416/416/xif0q/shoe/z/n/w/9-rso2773-9-red-tape-grey-original-imagqqyymghpztbk.jpeg?q=70",
    },
    {
      ids: 77,
      category: "accessories",
      subcategory: "shoes",
      product: "RED TAPE Sneaker Casual Shoes",
      price: 1349,
      description:
        "Sneaker Casual Shoes For Men | Soft Cushion Insole, Slip-Resistance Sneakers For Men  (White)",
      rating: 4.4,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/e/c/o/8-rsl002-red-tape-white-grey-original-imagqxvkvbbfz4jk.jpeg?q=70",
    },
    {
      ids: 78,
      category: "accessories",
      subcategory: "shoes",
      product: "WOODLAND Casuals For Men",
      price: 2391,
      description: "WOODLAND Casuals For Men  (Khaki)",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/832/832/kg9qbgw0-0/shoe/8/l/n/gc-1869115-39-woodland-khaki-original-imafwjfsn9re9kfg.jpeg?q=70",
    },
    {
      ids: 79,
      category: "accessories",
      subcategory: "shoes",
      product: "U.S. POLO ASSN. CLARKIN Sneakers For Men",
      price: 1349,
      description: "U.S. POLO ASSN. CLARKIN Sneakers For Men  (Grey)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/m/s/h/10-2fd20337g-10-u-s-polo-assn-grey-original-imags6adrjsfwnrg.jpeg?q=70",
    },
    {
      ids: 80,
      category: "accessories",
      subcategory: "shoes",
      product: "K- FOOTLANCE Casuals For Men",
      price: 429,
      description: "K- FOOTLANCE Casuals For Men  (Blue)",
      rating: 3.8,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/t/n/o/10-kc043-blu-k-footlance-blue-original-imag5ffhftjgga9s-bb.jpeg?q=70",
    },
    {
      ids: 81,
      category: "accessories",
      subcategory: "backpacks",
      product: "WESLEY Large 45 L Laptop Backpack",
      price: 699,
      description:
        "Large 45 L Laptop Backpack Unisex Travel hiking laptop bag fits upto 17.3 inch with Raincover and internal organiser backpack Rucksack College bag  (Grey, Blue)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/f/i/r/-original-imagh3w8zghgs7ev.jpeg?q=70",
    },
    {
      ids: 82,
      category: "accessories",
      subcategory: "backpacks",
      product: "PROVOGUE Large 40 L Laptop Backpack",
      price: 986,
      description:
        "Large 40 L Laptop Backpack unisex backpack with rain cover and reflective strip  (Green)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/kgv5x8w0/backpack/e/f/g/unisex-backpack-with-rain-cover-and-reflective-strip-p-039-original-imafxy82qrqxvbvm.jpeg?q=70",
    },
    {
      ids: 83,
      category: "accessories",
      subcategory: "backpacks",
      product: "SAFARI Medium 26 L Laptop Backpack",
      price: 769,
      description: "Medium 26 L Laptop Backpack Acheiver  (Blue)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/i/i/j/-original-imags4a79zt4xku9.jpeg?q=70",
    },
    {
      ids: 84,
      category: "accessories",
      subcategory: "backpacks",
      product: "PROVOGUE Large 35 L Laptop Backpack",
      price: 649,
      description:
        "Large 35 L Laptop Backpack Spacy unisex backpack with rain cover and reflective strip  (Blue)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/kddf6a80/backpack/f/g/g/spacy-unisex-backpack-with-rain-cover-and-reflective-strip-004-original-imafua3eku3uzywy.jpeg?q=70",
    },
    {
      ids: 85,
      category: "accessories",
      subcategory: "backpacks",
      product: "WROGN Large 35 L Laptop Backpack",
      price: 455,
      description:
        "Large 35 L Laptop Backpack SQAURISH PATACHES LAPTOP BAGPACK  (Green)",
      rating: 3.7,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/backpack/e/x/6/sqaurish-pataches-laptop-bagpack-square-pattern-laptop-backpack-original-imagpchfpywbunsg.jpeg?q=70",
    },
    {
      ids: 86,
      category: "accessories",
      subcategory: "wallets",
      product: "napa hide Men Tan Genuine Leather RFID Wallet ",
      price: 299,
      description:
        "Men Tan Genuine Leather RFID Wallet - Regular Size  (8 Card Slots)",
      rating: 3.9,
      image:
        "https://rukminim2.flixcart.com/image/832/832/k6b2snk0/wallet-card-wallet/r/h/w/protected-100-genuine-high-quality-mens-crunch-leather-wallet-original-imafzsxt57bzzegu.jpeg?q=70",
    },
    {
      ids: 87,
      category: "accessories",
      subcategory: "wallets",
      product: "Hammonds Flycatcher Men Brown Genuine Leather RFID Wallet",
      price: 473,
      description:
        "Men Brown Genuine Leather RFID Wallet - Mini  (5 Card Slots)",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/j/k/x/rfid-protected-redwood-brown-nappa-leather-wallet-for-men-1-2-original-imagkdg6eqqparvh.jpeg?q=70",
    },
    {
      ids: 88,
      category: "accessories",
      subcategory: "wallets",
      product: "WILDHORN Men Casual Black Genuine Leather Wallet",
      price: 479,
      description: "Men Casual Black Genuine Leather Wallet  (9 Card Slots)",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/e/c/n/rfid-protected-100-genuine-high-quality-mens-leather-wallet-original-imagm3hugwwzy65g.jpeg?q=70",
    },
    {
      ids: 89,
      category: "accessories",
      subcategory: "wallets",
      product: "FREAKS Men Brown Artificial Leather Wallet",
      price: 140,
      description: "Men Brown Artificial Leather Wallet - Mini  (3 Card Slots)",
      rating: 3.7,
      image:
        "https://rukminim2.flixcart.com/image/832/832/k3ahbww0/wallet-card-wallet/p/j/w/preet-brown-bmmww-wallet-for-men-preet-brown-bmwmw-wallet-for-original-imafgxappxaczjxy.jpeg?q=70",
    },
    {
      ids: 90,
      category: "accessories",
      subcategory: "wallets",
      product: "Gino Johnson Men Blue Genuine Leather Wallet",
      price: 455,
      description: "Men Blue Genuine Leather Wallet  (4 Card Slots)",
      rating: 3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/wallet-card-wallet/r/h/e/blured1-1-10-c1-4-wallet-gino-johnson-8-original-imagr6x7tj7raddb.jpeg?q=70",
    },
    {
      ids: 91,
      category: "accessories",
      subcategory: "sunglasses",
      product: "VINCENT CHASE Polarized, UV Protection Round Sunglasses",
      price: 883,
      description:
        "Polarized, UV Protection Round Sunglasses (50)  (For Men & Women, Green)",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/832/832/kvgzyq80/sunglass/j/0/f/149045-m-vincent-chase-original-imag8d97anmzwd5s.jpeg?q=70",
    },
    {
      ids: 92,
      category: "accessories",
      subcategory: "sunglasses",
      product: "VINCENT CHASE UV Protection Wayfarer Sunglasses",
      price: 569,
      description:
        "UV Protection Wayfarer Sunglasses (59)  (For Men & Women, Green)",
      rating: 4.2,
      image:
        "https://rukminim2.flixcart.com/image/832/832/l13whow0/sunglass/z/h/t/151516-59-vincent-chase-original-imagcryhrn7jdwrs.jpeg?q=70",
    },
    {
      ids: 93,
      category: "accessories",
      subcategory: "sunglasses",
      product: "PIRASO UV Protection Clubmaster Sunglasses",
      price: 245,
      description: "UV Protection Clubmaster Sunglasses (54)  (For Men, Black)",
      rating: 3.9,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sunglass/7/m/m/m-6090-single-sheet-black-piraso-original-imagkfkfpezkgrhx.jpeg?q=70",
    },
    {
      ids: 94,
      category: "accessories",
      subcategory: "sunglasses",
      product: "VINCENT CHASE Polarized, UV Protection Round Sunglasses",
      price: 883,
      description:
        "Polarized, UV Protection Round Sunglasses (50)  (For Men & Women, Green)",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/832/832/kvgzyq80/sunglass/j/0/f/149045-m-vincent-chase-original-imag8d97anmzwd5s.jpeg?q=70",
    },
    {
      ids: 95,
      category: "accessories",
      subcategory: "sunglasses",
      product: "Optimity Mirrored Rectangular Sunglasses",
      price: 679,
      description:
        "Mirrored, Night Vision, UV Protection Rectangular Sunglasses (Free Size)  (For Men & Women, Black)",
      rating: 4.1,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/sunglass/h/x/7/58-4413-bowix-original-imaghztukzbezbze.jpeg?q=70",
    },
    {
      ids: 96,
      category: "accessories",
      subcategory: "watch",
      product: "Sonata Analog Watch",
      price: 435,
      description: "Sonata Volt 3.0 Analog Watch - For Men NP77085PP09W",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/b/l/b/-original-imagnydrzykaghd9.jpeg?q=70",
    },
    {
      ids: 97,
      category: "accessories",
      subcategory: "watch",
      product: "Sonata Analog Watch",
      price: 539,
      description: "Analog Watch - For Men 7142SL03",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/h/m/e/-original-imagrgwwvjfd5ybd.jpeg?q=70",
    },
    {
      ids: 98,
      category: "accessories",
      subcategory: "watch",
      product: "Allen Solly Analog Watch",
      price: 1022,
      description: "Analog Watch - For Men AS000010E",
      rating: 4.3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/m/k/w/-original-imagrcjhxzmmgedc.jpeg?q=70",
    },
    {
      ids: 99,
      category: "accessories",
      subcategory: "watch",
      product: "GUESS Analog Watch",
      price: 6998,
      description: "Black Dial Analog Watch - For Men GW0446G2",
      rating: 4.4,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/b/h/q/-original-imagp9yytz7v2sjt.jpeg?q=70",
    },
    {
      ids: 100,
      category: "accessories",
      subcategory: "watch",
      product: "ANALOGUE Analog Watch",
      price: 245,
      description:
        "All Matte Grey Elegant Series with Water Resistant & 1 Year Quartz Machinery Warranty Analog Watch - For Boys ANLG-428-GREY-GREY",
      rating: 3,
      image:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/watch/r/a/h/-original-imagpzzjeymdfvye.jpeg?q=70",
    },
    {
      ids: 101,
      category: "women",
      subcategory: "tshirts",
      product: "Boxy T-shirt",
      price: 699,
      description:
        "Boxy T-shirt in soft cotton jersey with a round, rib-trimmed neckline, dropped shoulders and wide sleeves that finish just above the elbow",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F00%2F0f%2F000f61c10d0a70fc44437270fc8d3073238ad09d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 102,
      category: "women",
      subcategory: "tshirts",
      product: "Oversized T-shirt",
      price: 699,
      description:
        "Oversized T-shirt in soft cotton jersey with a rib-trimmed neckline and low dropped shoulders.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F61%2F60%2F61605a4986e807372edab31245c4b918bc1a450a.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 103,
      category: "women",
      subcategory: "tshirts",
      product: "Oversized T-shirt",
      price: 1299,
      description:
        "Oversized T-shirt in soft cotton jersey with a print motif on the front. Ribbed trim around the neckline and dropped shoulders.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F54%2F0f%2F540f9169ab4bab0115a3ddf35e4661e836ab4b8f.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 104,
      category: "women",
      subcategory: "tshirts",
      product: "V-neck T-shirt",
      price: 799,
      description:
        "T-shirt in viscose jersey with a deep V-neckline and a straight-cut hem",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F0e%2F4e%2F0e4eab8f679a825376e87650862d86ffdda8fe2c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 105,
      category: "women",
      subcategory: "tshirts",
      product: "Oversized printed T-shirt",
      price: 1299,
      description:
        "Oversized T-shirt in soft, printed cotton jersey with a ribbed trim around the neckline and dropped shoulders.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F98%2F4c%2F984ca3bf7032a4eb76185fe1abcc9ff21b204e04.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 106,
      category: "women",
      subcategory: "tops",
      product: "Flounce-trimmed top",
      price: 2699,
      description:
        "Sleeveless top in woven fabric with a slight sheen. Round neckline and an opening with a concealed button at the back of the neck.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F40%2F70%2F40702755472c687a9b098108c4fddfd9cb898b8e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 107,
      category: "women",
      subcategory: "tops",
      product: "Ribbed modal-blend top",
      price: 799,
      description:
        "Fitted top in soft, ribbed cotton and modal jersey with a round neckline and long sleeves.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F86%2Fb8%2F86b8b65cb530dd2fc648ecea5a9d11f08982bbd8.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 108,
      category: "women",
      subcategory: "tops",
      product: "Off-the-shoulder top",
      price: 1499,
      description:
        "Fitted, off-the-shoulder top in heavy jersey made from a viscose blend. Long sleeves and a straight-cut hem.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F7f%2F31%2F7f31853cbcce032d380d37ece7b4858ccbeddd04.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 109,
      category: "women",
      subcategory: "tops",
      product: "Jersey vest top",
      price: 1499,
      description:
        "Fitted vest top in sturdy jersey made from a viscose blend with V-shaped boning at the front creating the perfect sweetheart neckline. Lined at the top.",
      rating: 4,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F80%2F66%2F806632cdd6b19f5dcae3b78c4ddff0d918157c04.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 110,
      category: "women",
      subcategory: "tops",
      product: "Draped turtleneck top",
      price: 1299,
      description:
        "Fitted top in jersey with a turtle neck, long sleeves and gathered seams at one shoulder and at the sides for a draped effect.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F34%2F77%2F3477cb0887807f2683008558e93c049af27ac85b.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 111,
      category: "women",
      subcategory: "trouser",
      product: "Wide trousers",
      price: 2699,
      description:
        "Tailored, loose-fitting trousers in woven fabric. High waist with concealed elastication and a zip fly.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fb6%2F09%2Fb6096827602d518ec0c0f4370b456a07e0662711.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 112,
      category: "women",
      subcategory: "trouser",
      product: "Cotton-blend sweatpants",
      price: 1299,
      description:
        "Sweatpants in soft sweatshirt fabric made from a cotton blend. High waist with covered elastication and a drawstring, side pockets, and covered elastication at the hems. Soft brushed inside",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2Fa2%2Fe4%2Fa2e43ada543916808b6ed0999b59f8f2b6cdd40e.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 113,
      category: "women",
      subcategory: "trouser",
      product: "Crinkled trousers",
      price: 2199,
      description:
        "Trousers in crinkled jersey. Loose fit with a high, elasticated waist and wide, straight legs.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F59%2F1e%2F591eea38faaf08709c41e0155e9dfdcef0ba5c28.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 114,
      category: "women",
      subcategory: "trouser",
      product: "Canvas cargo trousers",
      price: 1799,
      description:
        "Relaxed-fit cargo trousers in cotton canvas. Low waist with covered elastication at the sides and back, a zip fly with a press-stud, diagonal side pockets and straight legs.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fae%2F4a%2Fae4a81ef868de9b79c196c0bd4098f91ca5473c4.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 115,
      category: "women",
      subcategory: "trouser",
      product: "Twill cargo trousers",
      price: 1999,
      description:
        "Loose-fit cargo trousers in cotton twill with a high waist and a zip fly and button. Diagonal front pockets, back pockets and bellows leg pockets.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F00%2Fbf%2F00bf2c7fd7c1e8d8313a14a66cd61b027fa73e2c.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 116,
      category: "women",
      subcategory: "blazers",
      product: "Double-breasted blazer",
      price: 3599,
      description:
        "Loose-fit, double-breasted blazer in woven fabric with notch lapels and buttons at the front. Welt chest pocket, welt front pockets with a flap, and a single back vent.",
      rating: 4.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fa6%2F3f%2Fa63f69ead6ba210fbc25cd7022e7e6293cf17403.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 117,
      category: "women",
      subcategory: "blazers",
      product: "Oversized bouclé blazer",
      price: 3599,
      description:
        "Oversized blazer in a bouclé weave with peak lapels and gold-coloured buttons at the front. Shoulder pads, long sleeves and flap front pockets. Lined.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F8a%2F99%2F8a99826d883e11dba3c0bc3abf2e5514eacf999d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    },
    {
      ids: 118,
      category: "women",
      subcategory: "blazers",
      product: "Double-breasted blazer",
      price: 2699,
      description:
        "Double-breasted blazer in woven fabric with peak lapels and buttons at the front. Shoulder pads, long sleeves, jetted front pockets with a flap and a welt chest pocket. Lined.",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fe2%2F97%2Fe29736ec172cce57914212f721f3200d96be60bf.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 119,
      category: "women",
      subcategory: "blazers",
      product: "Single-breasted jacket",
      price: 2999,
      description:
        "Single-breasted jacket in woven fabric with notch lapels and a single button at the front. ",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F4d%2F83%2F4d8322a2f62b806c06706f5accb4ee6f52d18399.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 120,
      category: "women",
      subcategory: "blazers",
      product: "Single-breasted blazer",
      price: 4999,
      description:
        "Single-breasted blazer in woven fabric. Loose fit with peak lapels and one button at the front. Shoulder pads and long sleeves with buttoned cuffs. ",
      rating: 4.1,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F57%2Faa%2F57aaf3f3efec339fd0a68387d6cffd8319e20ae1.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
    },
    {
      ids: 121,
      category: "women",
      subcategory: "dress",
      product: "Pleated chiffon dresst",
      price: 3999,
      description:
        "Calf-length dress in crêpe chiffon with gathers at the front and back and a round neckline with a small opening and a concealed button at the front.",
      rating: 5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fac%2F98%2Fac98f9520a988d4b92ca8837da984caf32b10e36.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 122,
      category: "women",
      subcategory: "dress",
      product: "Satin shirt dress",
      price: 1499,
      description:
        "Short dress in softly draping satin with a collar and buttons down the front. Long balloon sleeves with buttoned cuffs, narrow elastication at the waist and a straight-cut hem.",
      rating: 3.5,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F29%2F23%2F29238b7950926ed2749947e7cfbdea0fcc3a3fd5.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 123,
      category: "women",
      subcategory: "dress",
      product: "Satin slip dress",
      price: 2299,
      description:
        "Calf-length dress in softly draping satin with a square neckline, adjustable spaghetti shoulder straps and a concealed zip at one side.",
      rating: 4,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F03%2F70%2F0370aa8147f5441680a3292e34fb127565b73d7b.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 124,
      category: "women",
      subcategory: "dress",
      product: "Boxy T-shirt",
      price: 699,
      description:
        "Boxy T-shirt in soft cotton jersey with a round, rib-trimmed neckline, dropped shoulders and wide sleeves that finish just above the elbow",
      rating: 4.3,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F00%2F0f%2F000f61c10d0a70fc44437270fc8d3073238ad09d.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
    {
      ids: 125,
      category: "women",
      subcategory: "dress",
      product: "Tie-detail satin dress",
      price: 2999,
      description:
        "Boxy T-shirt in soft cotton jersey with a round, rib-trimmed neckline, dropped shoulders and wide sleeves that finish just above the elbow",
      rating: 3.1,
      image:
        "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fd8%2F9e%2Fd89e98b5bf787f163351bbcddbda9f8a080e8a5b.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
    },
  ];

  Product.insertMany(data)
    .then(() => console.log("Products added to the database"))
    .catch((err) => console.error("Error adding Products:", err));
};

const deleteData = async (req, res) => {
  await Product.collection.drop();
};

module.exports = { SignIn, Register, data, addData, deleteData };
