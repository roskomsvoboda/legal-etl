
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const URL = require('url')

puppeteer.use(StealthPlugin())

const path = require('path')

class HttpRequests {

    #url
    #browser
    #page

    #timeout
    #waitUntil

    constructor({
        timeout = 60000,
        waitUntil = ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] || 'load' || 'domcontentloaded' || 'networkidle0' || 'networkidle2',
    }) {

        this.#timeout = timeout

        this.#waitUntil = waitUntil

    }

    async #BrowserPage(host) {

        if (!this.#browser) {

            const u = new URL(host)

            if (!u.origin) throw Error('HttpRequests: parameters not specified "url"')

            this.#url = u.origin

            this.#browser = await puppeteer.launch({ 
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ] 
            })

            this.#page = await this.#browser.newPage()

            await this.#page.goto(this.#url, { timeout: this.#timeout, waitUntil: this.#waitUntil })

            await this.#page.addScriptTag({ path: path.join(__dirname, 'jquery-3.6.0.min.js') })

            // await this.#page.screenshot({ path: 'testresult.png', fullPage: true })

        }

    }

    async QXML({
        dataType = 'json',
        contentType = "application/json",
        Accept = 'application/json; charset=utf-8',
        url,
        data = {},
        evaluateFn,
        type = 'POST' || 'GET'
    }) {

        await this.#BrowserPage(url)

        const ajax_options = {
            url,
            type,
            dataType,
            contentType,
            Accept,
            data,
        }

        const execFn = (ajax_options) => {
            try {
                return $.ajax(ajax_options)
            } catch (e) {
                return e.message
            }
        }

        const result = await this.#page.evaluate(evaluateFn || execFn, ajax_options)

        return result

    }

    destroy() {
        if (this.#browser) this.#browser.close()
    }

}

module.exports = HttpRequests
