const puppeteer = require('puppeteer');
const expect = require('chai').expect;

const {click,getText,getCount,shouldExist,waitForText} = require('../lib/helper')

const generateEmailonAcademy = require('../lib/utils').generateEmailonAcademy

describe('BenQ Academy - Pass the test',()=>{
    let browser
    let page
    //Test Hooks:before, beforeEach, after, afterEach
    //before:每個test case執行之前先做的動作(page/browswer)
    before(async function(){
        browser=await puppeteer.launch({
            executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless:true,//無介面模式:有無需要開視窗,false要開,true不開
            slowMo:100,// slow down by 100ms
            devtools:false//有無需要開啟開發人員工具
        })
        page=await browser.newPage()
        //設定像素
        await page.setViewport({width:1200,height:1000})

        await page.setDefaultTimeout(200000)//會修改goto,goBack,goForward,reload, setContent, waitForNavigation, page.waitForFunction, page.waitForFileChooser,page.waitForSelector等method的時間，預設是 30 秒
        await page.setDefaultNavigationTimeout(200000)//會修改goto,goBack,goForward,reload, setContent, waitForNavigation等method的時間，預設是 30 秒
    })
    //after:每個test case執行之後統一要做的動作(page/browswer)
    after(async function(){
        await browser.close()
    })
    // beforeEach(async function(){
    //     //Runs before each test steps(pre-step;像是登入)
    //     await page.goto('http://example.com/')
    // })
    //afterEach(async function(){
        //Runs after each test steps(所有test step執行完的步驟)
    //})

    it('Create a new account',async function(){
        await page.goto('https://www.benq.academy/register')
        await page.waitForSelector('form')
        //First name
        await page.type('form > div:nth-child(1) > div:nth-child(1) > input ','Celine',{delay:10})
        await page.waitForTimeout(100)//等待100毫秒
        //Last Name
        await page.type('form > div:nth-child(1) > div:nth-child(2) > input ','Test ',{delay:10})
        await page.waitForTimeout(100)//等待100毫秒
        //E-mail
        const testEmail = generateEmailonAcademy()
        await page.type('form > div:nth-child(2) > input ',testEmail,{delay:10})
        console.log("test email:",testEmail)
        await page.waitForTimeout(5000)
        //Company, school or organization name
        await page.type('#Workplace','Test By Celine',{delay:10})
        await page.waitForTimeout(100)//等待100毫秒
        //Profession(Teacher/Reseller/ITS)
        //選擇ITS
        await page.select('form > div:nth-child(4) > select', '3')
        // await selectITS.type('ITS');
        //Password
        await page.type('form > div:nth-child(5)  > input ','test123',{delay:10})
        await page.waitForTimeout(100)//等待100毫秒
        //Re-enter Password
        await page.type('form > div:nth-child(6) > input ','test123',{delay:10})
        await page.waitForTimeout(100)//等待100毫秒
        //點擊privace policy
        await page.click('form > div.text-xs > label > input',{clickCount:1})
        await page.waitForTimeout(5000)//等待5000毫秒
        //點擊submit
        await page.click('form > div.flex.justify-center > button')
        await page.waitForTimeout(10000)//等待10000毫秒
        //註冊完會自動導向至首頁
        const afterSignUpurl = await page.url()
        expect(afterSignUpurl).to.include('https://www.benq.academy/')//斷言:此page的url必須包含https://www.benq.academy/
        console.log("After Sign Up URL :",afterSignUpurl)
    })
    it('Take a training class ',async function(){
        await page.click('ul.nav-menu > li:nth-child(2) > a')
        await page.waitForTimeout(10000)//等待10000毫秒
        const trainedurl = await page.url()
        expect(trainedurl).to.include('/trained')//斷言:此page的url必須包含/trained
        await page.waitForTimeout(5000)//等待5000毫秒
        //等待課程列表出現
        await page.waitForSelector('#app')
        //等待AMS課程出現
        await page.waitForSelector('#app > div > div:nth-child(2) > ul > li:nth-child(12)')
        //點擊AMS的trained按鈕
        await page.waitForSelector('#app > div > div:nth-child(2) > ul > li:nth-child(12) > div:nth-child(2) > button')
        await page.click('#app > div > div:nth-child(2) > ul > li:nth-child(12) > div:nth-child(2) > button')
        await page.waitForTimeout(10000)//等待10000毫秒
        //斷言是否進入課程
        const trainedVideoUrl = await page.url()
        expect(trainedVideoUrl).to.include('/video')//斷言:此page的url必須包含/video
        expect(trainedVideoUrl).to.include('/QBMDQX')//斷言:此page的url是AMS的URL
        console.log("trainedVideo URL :",trainedVideoUrl)
        //等待課程播放器
        await page.waitForSelector('#youtubePlay')
        await page.click('#youtubePlay')
        //影片64000毫秒+等待跳轉至Certification頁面10000毫秒
        await page.waitForTimeout(75000)//等待75000毫秒
        const afterTrainedUrl = await page.url()
        expect(afterTrainedUrl).to.include('/trained/exam')//斷言:此page的url必須包含/trained/exam
        expect(afterTrainedUrl).to.include('/QBMDQX')//斷言:此page的url是AMS的URL
        console.log("After Trained URL :",afterTrainedUrl)
        await page.waitForTimeout(5000)//等待5000毫秒
    })
    it('Certification',async function(){
        await page.waitForSelector('#app')
        //Q1答題區=>2
        await page.waitForSelector('#app > div > div.exam-box > div > div:nth-child(1) > div:nth-child(2)')
        await page.click('#option1-486',{clickCount:1})//點擊2.account management solution
        //Q2答題區=>3
        await page.waitForSelector('#app > div > div.exam-box > div > div:nth-child(2) > div:nth-child(2)')
        await page.click('#option1-490',{clickCount:1})//點擊3.NFC
        //Q3答題區=>1,2,3
        await page.waitForSelector('#app > div > div.exam-box > div > div:nth-child(3) > div:nth-child(2)')
        await page.click('#option1-491',{clickCount:1})//點擊1.Google Drive
        await page.click('#option1-492',{clickCount:1})//點擊2.One Drive
        await page.click('#option1-493',{clickCount:1})//點擊3.Dropbox
        //Q4答題區=>1
        await page.waitForSelector('#app > div > div.exam-box > div > div:nth-child(4) > div:nth-child(2)')
        await page.click('#option1-496',{clickCount:1})//點擊1.True
        //Q5答題區=>1
        await page.waitForSelector('#app > div > div.exam-box > div > div:nth-child(5) > div:nth-child(2)')
        await page.click('#option1-498',{clickCount:1})//點擊1.True
        await page.waitForTimeout(5000)//等待5000毫秒
        await page.waitForSelector('#app > div > div:nth-child(3) > button')
        await page.click('#app > div > div:nth-child(3) > button',{clickCount:1})//點擊submit
        await page.waitForTimeout(10000)//等待10000毫秒

    })
    it('Pass the test',async function(){
        const passUrl = await page.url()
        expect(passUrl).to.include('/grades/QBMDQX')//斷言:此page的url必須包含/grades/QBMDQX
        await page.waitForTimeout(10000)//等待10000毫秒
        await page.click('#exam-success > div > div:nth-child(2) > div > div > button')//finish
        await page.waitForTimeout(10000)//等待10000毫秒
    })
    it('input first name & last name & company name on the form',async function(){
        await page.waitForSelector('form')
        await page.waitForSelector('form > div:nth-child(1) > div:nth-child(1) > input') //First Name
        await page.waitForSelector('form > div:nth-child(1) > div:nth-child(2) > input') //Last Name
        await page.waitForSelector('form > div:nth-child(2) > input') //Company Name
        await page.waitForSelector('form > div:nth-child(4) > button') //Submit
        await page.click('form > div:nth-child(4) > button') //Submit
        await page.waitForTimeout(10000)//等待10000毫秒
    })
     it('Get my Certification',async function(){
        const downloadYourCertificate = await getText(page, 'h1')
        expect(downloadYourCertificate).to.be.a('string','Download your certificate')//斷言:h1內容必須為Download your certificate
        console.log(downloadYourCertificate)
        const downloadUrl = await page.url()
        expect(downloadUrl).to.include('/certified/download/QBMDQX')//斷言:此page的url必須包含/certified/download/QBMDQX
        console.log(downloadUrl)
        await shouldExist(page,'#app > div > div:nth-child(2) > div > div > div:nth-child(1) > img')//Certification
        await shouldExist(page,'#app > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div > a')//download button
        await page.waitForSelector('#app > div > div:nth-child(2) > div > div > div:nth-child(2) > div > ul') //share button
        const shareButtoncount = await getCount(page, '#app > div > div:nth-child(2) > div > div > div:nth-child(2) > div > ul > li')
        expect(shareButtoncount).to.equal(4)//斷言:此page的shareButton(li)元素的數目必須為4
        console.log(shareButtoncount)
        //await page.waitForSelector('#app > div > div:nth-child(2) > div > div > ul > li') //share button*4
        await page.waitForTimeout(10000)//等待10000毫秒
        const date = new Date()
        function wholeMonth(){
            var getmonth = date.getMonth() + 1
            if(getmonth<10){
                wholeMonth =  "0"+getmonth 
                return wholeMonth
            }else{
                wholeMonth = getmonth 
                return wholeMonth
            }
        }
        function wholeDate(){
            const getDay = date.getDate()
            if(getDay<10){
                wholeDate =  "0"+getDay
                return wholeDate
            }else{
                wholeDate = getDay 
                return wholeDate
            }
        }
        const month = wholeMonth()
        const day = wholeDate()
        const year = date.getFullYear()
        const fullDate = `${year}${month}${day}`
        const certificationPath = "./certification/certification-"
        const file = ".png"
        const certificationFileName = certificationPath + fullDate + file
        console.log(certificationFileName)
        await page.screenshot({path: certificationFileName, fullPage:true})
     })
})
