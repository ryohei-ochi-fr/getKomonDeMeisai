import { chromium } from "playwright";
import { exit } from "process";
import fs from "fs";
import path from "path";


(async () => {
  if (typeof process.argv[2] === "undefined") {
    console.log("usage: npx ts-node id pw");
    console.log(
      "download path: %s",
      __dirname.replace("backend", "download/")
    );
    exit();
  }

  const id = process.argv[2];
  const pw = process.argv[3];
  const downloadPath = __dirname.replace("backend", "download");
  const savePath = __dirname.replace("backend", "download/");
  console.log("download path: %s", savePath);

  let selectedYaer: string = "";
  let selectedMonth: string = "";
  let meisaiNum: number = 0;
  let destPath: string = "";

  // ブラウザのユーザデータを作成する
  const userDataDir = path.join(__dirname, "user_data");
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir);
  }

  // PDFを内部ビュワーで開かない設定とする
  const defaultPreferences = {
    plugins: {
      always_open_pdf_externally: true,
    },
  }
  
  // ヘッドレス(ブラウザの非表示)も可能だけど、今回はあえて false にしてます。
  const browser = await chromium.launchPersistentContext(userDataDir,{
    // headless: true, // 非表示
    headless: false, // 表示
    slowMo: 500,
  });

  fs.writeFileSync(userDataDir + '/Default/Preferences', JSON.stringify(defaultPreferences));

  const page = await browser.newPage();
  await page.goto("https://www1.shalom-house.jp/komon/login.aspx");

  await page.locator('//*[@id="txtID"]').fill(id);

  await page.locator('//*[@id="txtPsw"]').fill(pw);

  await page.locator('//*[@id="btnLogin"]').click();

  await page.locator('//*[@id="btnLogin2"]').click();

  await page
    .locator('//*[@id="ctl00_ContentPlaceHolder1_imgBtnMeisai"]')
    .click();

  // ログインから給与明細の検索までたどり着いた

  // 発行年を取得
  const selectBoxYear = page.locator(
    '//*[@id="ctl00_ContentPlaceHolder1_cboNen"]'
  );
  const optionsYearAll = await selectBoxYear.locator("option").all();
  selectedYaer = await selectBoxYear.inputValue();
  console.log("選択された年: %s", selectedYaer);

  // 2025を除去
  optionsYearAll.pop();

  if (true) {
    // すべての発行年を取得して表示
    for (const option of optionsYearAll) {
      const text = await option.textContent();
      console.log(text);
    }
  }

  // 発行月を取得
  const selectBoxMonth = page.locator(
    '//*[@id="ctl00_ContentPlaceHolder1_cboMonth"]'
  );
  const optionsMonth = await selectBoxMonth.locator("option").all();
  selectedMonth = await selectBoxMonth.inputValue();
  console.log("選択された月: %s", selectedMonth);

  if (true) {
    // すべての発行月を取得して表示
    for (const option of optionsMonth) {
      const text = await option.textContent();
      console.log(text);
    }
  }

  // 未選択の空文字を削除
  optionsYearAll.shift();
  optionsMonth.shift();

  // 現在から過去へ逆転
  optionsYearAll.reverse();
  optionsMonth.reverse();

  // ここからループ
  for (const option of optionsYearAll) {
    const targetYaer = await option.textContent();
    // console.log("target yaer: %s", targetYaer);

    for (const option of optionsMonth) {
      const targetMonth = await option.textContent();
      const numberMounth: number = Number(targetMonth);

      // 7月分が公開されたら 7
      // 開発中は 6
      if (targetYaer == "2024" && (numberMounth > 7 || targetMonth == "")) {
        console.error("target: %s/%s", targetYaer, targetMonth);
      } else {
        console.log("target: %s/%s", targetYaer, targetMonth);

        // 年を指定する
        // selectedYaer = "2023";
        await page.selectOption(
          '//*[@id="ctl00_ContentPlaceHolder1_cboNen"]',
          targetYaer
        );

        // 月を指定する
        // selectedMonth = "4";
        await page.selectOption(
          '//*[@id="ctl00_ContentPlaceHolder1_cboMonth"]',
          targetMonth
        );

        // 検索ボタン
        // //*[@id="ctl00_ContentPlaceHolder1_btnSearch"]
        await page
          .locator('//*[@id="ctl00_ContentPlaceHolder1_btnSearch"]')
          .click();

        // 賞与月 4月 10月の処理
        // <td class="conDataLR textC" align="center">
        // <a id="ctl00_ContentPlaceHolder1_grvSyain_ctl02_lnkPayDate" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$grvSyain$ctl02$lnkPayDate','')">2024年04月30日</a>
        // </td>

        // 明細数を確認する 賞与月以外は 0
        const linkElement = page.locator('td[class="conDataLR textC"]');
        meisaiNum = await linkElement.count();

        // 明細が複数存在する場合の処理 (賞与月 4月 10月)
        if (meisaiNum > 0) {
          for (let i: number = meisaiNum; i > 0; i--) {
            console.log("setp: %s", i);

            if (meisaiNum > 0) {
              const downloadPromise = page.waitForEvent("download");

              // 支給日のリンクをクリックする
              await linkElement
                .nth(i - 1)
                .locator("a")
                .click();

              // 印刷ボタン押下
              await page
                .locator('//*[@id="ctl00_ContentPlaceHolder1_btnPrint"]')
                .click();

              const download = await downloadPromise;

              destPath =
                savePath +
                id +
                "/" +
                "給与明細書_" +
                id +
                "_" +
                targetYaer +
                "年" +
                targetMonth +
                "月_" +
                i.toString() +
                ".pdf";

              await download.saveAs(destPath);
              await download.delete();

              // 戻るボタン押下
              await page
                .locator('//*[@id="ctl00_ContentPlaceHolder1_btnClose"]')
                .click();
            }
          }
        } else {
          console.log("setp: 1");
          const downloadPromise = page.waitForEvent("download");

          //page.waitForTimeout(500);

          // 印刷ボタン押下
          // //*[@id="ctl00_ContentPlaceHolder1_btnPrint"]
          await page
            .locator('//*[@id="ctl00_ContentPlaceHolder1_btnPrint"]')
            .click();

          const download = await downloadPromise;

          destPath =
            savePath +
            id +
            "/" +
            "給与明細書_" +
            id +
            "_" +
            targetYaer +
            "年" +
            targetMonth +
            "月.pdf";

          await download.saveAs(destPath);
          await download.delete();

          // 戻るボタン押下
          await page
            .locator('//*[@id="ctl00_ContentPlaceHolder1_btnClose"]')
            .click();
        }

        // キャッシュクリアのショートカット(効かなかったし不要)
        //await page.keyboard.press('Shift+Control+Delete')
      }
    }
  }

  // 開発者モードで要素を選択して、XPath式で要素をある程度は事前に特定しておく、以下はメモ

  // 印刷ボタン
  // //*[@id="ctl00_ContentPlaceHolder1_btnPrint"]
  // await page.locator('//*[@id="ctl00_ContentPlaceHolder1_btnPrint"]').click();

  // 戻るボタン
  // //*[@id="ctl00_ContentPlaceHolder1_btnClose"]
  // await page.locator('//*[@id="ctl00_ContentPlaceHolder1_btnClose"]').click();

  // 機能選択
  // //*[@id="btnLogin2"]

  // 給与明細
  // //*[@id="ctl00_ContentPlaceHolder1_imgBtnMeisai"]

  // セレクトボックス 年
  // //*[@id="ctl00_ContentPlaceHolder1_cboNen"]

  // セレクトボックス 月
  // //*[@id="ctl00_ContentPlaceHolder1_cboMonth"]

  // 検索ボタン
  // //*[@id="ctl00_ContentPlaceHolder1_btnSearch"]

  // 印刷ボタン
  // //*[@id="ctl00_ContentPlaceHolder1_btnPrint"]

  // 戻るボタン
  // //*[@id="ctl00_ContentPlaceHolder1_btnClose"]

  // Kyuyo_viewer.aspx ここがpdf

  // ページを閉じる
  await page.close();

  // ブラウザを閉じる
  await browser.close();

})();
