const puppeteer = require('puppeteer');

const width = () => Math.floor(Math.floor(Math.random() * 200 + 1000))
const height = () => Math.floor(Math.floor(Math.random() * 200 + 600)) 

const winSize = () => ({ width: width(), height: height() })

const inputSelector = 'input[name="q"]'
const formSelector = 'form[action="/search"]'

const google = async (searchTerm) => {
  let browser = {}
  let content = ''

  try {
    browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()    
    await page.setViewport(winSize())

    const url = 'https://www.google.com'
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.click(inputSelector)
    await page.keyboard.type(searchTerm)
    await page.$eval(formSelector, form => form.submit());
  
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    content = await page.content()
  }
  catch(err) {
    console.error(err)
  }
  finally {
    if(typeof(browser.close) === 'function') {
      await browser.close()
    }    
  }

  return content
}

module.exports = google