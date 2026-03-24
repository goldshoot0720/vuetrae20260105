<template>
  <section class="page">
    <div class="header">
      <div class="badge">🎵</div>
      <h2>鋒兄音樂歌詞</h2>
      <div class="actions">
        <button class="btn primary">新增歌詞</button>
      </div>
    </div>
    <div class="toolbar">
      <input class="search" placeholder="搜尋歌詞..." />
      <button class="btn">🔍 搜尋</button>
    </div>
    <div class="cards">
      <div class="card" v-for="lyric in lyricsList" :key="lyric.name" @click="viewLyric(lyric)">
        <div class="thumb lyrics"></div>
        <div class="meta">
          <div class="name">{{ lyric.name }}</div>
          <div class="info">作詞：鋒兄 · 作曲：AI</div>
        </div>
      </div>
    </div>

    <!-- 歌詞檢視 Modal -->
    <div v-if="selectedLyric" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ selectedLyric.name }}</h3>
        
        <!-- 音檔播放器 -->
        <div v-if="selectedLyric.audios && selectedLyric.audios.length > 0" class="audio-player-section">
          <div class="audio-tabs">
            <button 
              v-for="(audio, index) in selectedLyric.audios" 
              :key="index"
              class="audio-tab"
              :class="{ active: currentAudioIndex === index }"
              @click="currentAudioIndex = index"
            >
              {{ audio.label }}
            </button>
          </div>
          <audio v-if="selectedLyric.audios[currentAudioIndex].url" :src="selectedLyric.audios[currentAudioIndex].url" controls autoplay class="audio-control"></audio>
          <div v-else class="no-audio-message">（此版本暫無音檔，僅供歌詞瀏覽）</div>
        </div>

        <div class="lyrics-text">
          <pre>{{ (selectedLyric.audios && selectedLyric.audios[currentAudioIndex] && selectedLyric.audios[currentAudioIndex].lyrics) || selectedLyric.content }}</pre>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">關閉</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const selectedLyric = ref(null);
const currentAudioIndex = ref(0);

// 當切換選中的歌詞時，重置音檔索引
watch(selectedLyric, () => {
  currentAudioIndex.value = 0;
});

const lyricsList = ref([
  { 
    name: '鋒兄進化Show🔥', 
    audios: [
      { label: '中文版', url: 'https://api.stormkit.io/volumes/file/0UXeD7XkvwiWmz6Hnsdil5gjNtFj1XEXqxjzRyt0Pk6l4b8Wsg==' },
      { 
        label: '英文版', 
        url: 'https://api.stormkit.io/volumes/file/ti9PUMEhNNa9B0aBtPym70qAoyJJoxoR2Jxb9Z9WmKYwVLnuWA==',
        lyrics: `Hook
 Taipei is great with Brother Feng! 
 
 Get hyped, don't run away! 
 
 From top scorer to mayor, this rhythm is insane (wow) 
 
 Brother Tu singing, don't be shy, reporters are taking photos! 
 
 Verse 1
 At 37, I topped the civil service exam (yeah) 
 
 Information processing made me legendary, code became legend~ 
 
 At 52, deputy mayor, acting mayor, so busy! (yo) 
 
 Chorus
 Taipei is great with Brother Feng! 
 
 Get hyped, don't run away! 
 
 From top scorer to mayor, destiny explodes like debugging! 
 
 Brother Tu's voice at max, everyone singing along! 
 
 Verse 2
 In 2040's night, neon lights flash at city hall 
 
 Campaign slogans like ACG opening 
 
 "Don't say impossible, Brother Feng is evolution!" 
 
 Final Chorus
 Taipei is great with Brother Feng! 
 
 Get hyped until dawn! 
 
 Evolution from top scorer to mayor, the whole city screaming! 
 
 This is Brother Feng Evolution Show! 🔥`
      },
      { 
        label: '日語版', 
        url: 'https://api.stormkit.io/volumes/file/SF1NZ2_lvlxvw7PZOqZqX-uffZAT0J7pAnBmmlPqIr27aHxssA==',
        lyrics: `Hook
 台北に鋒兄がいて本当に良い！ 
 盛り上がって逃げるな！ 
 トップから市長への進化、このリズムはヤバい（wow） 
 塗哥は歌って控えめにするな、記者が写真を撮ってる！ 

 Verse 1
 37歳の年に公務員試験でトップ（yeah） 
 情報処理で一戦成名　プログラムは伝説になった～ 
 52歳で副市長、代理市長で忙しい！（yo） 

 Chorus
 台北に鋒兄がいて本当に良い！ 
 盛り上がって逃げるな！ 
 トップから市長への進化、運命はデバッグのように爆発！ 
 塗哥の声は最大、全員が大合唱！ 

 Verse 2
 2040年の夜　ネオンが市政庁に輝く 
 選挙スローガンはACGのオープニングのよう 
 「不可能と言うな、鋒兄は進化だ！」 

 Final Chorus
 台北に鋒兄がいて本当に良い！ 
 朝まで盛り上がれ！ 
 トップから市長への進化論　全市が叫んでる！ 
 これは鋒兄進化Show！🔥`
      },
      { 
        label: '粵語版', 
        url: 'https://api.stormkit.io/volumes/file/keofAd7GMEtTdbGgSmQRIevERreU4D9JsmNRGHAX78PZR4ADjg==',
        lyrics: `Hook
 台北有鋒兄真好！嗨起嚟唔好逃跑！ 
 從榜首進化到市長, 呢個節奏太誇張（wow） 
 塗哥唱歌唔好扮低調, 記者都係影相！ 
 綾小路都話呢段人生 根本 S 級動畫稿～ 

 Verse 1
 37歲嗰年我高考三級奪榜首（yeah） 
 資訊處理一戰成名 程式都寫成傳說～ 
 隔住時代嘅螢幕光 夢想好似演算法（run） 
 52歲副市長代理市長忙住上陣！（yo） 

 Verse 2
 塗哥敢唱「有鋒兄真好」備取瞬間正取秒秒到～ 
 唔唱就取消資格笑　進化唔靠運氣靠信號！ 

 Chorus
 台北有鋒兄真好！嗨起嚟唔好逃跑！ 
 從榜首進化到市長, 命運好似 debug 爆！ 
 塗哥嗓門開到爆表, 全場跟住大合唱！ 
 「代理」只係過場 市民心中早就想！ 

 Verse 3
 2040嗰年的夜 霓虹閃爍到市政廳 
 競選口號似 ACG 嘅 opening 
 「唔好話唔可能, 鋒兄就係 evolution！」 
 AI 輔助政務操作 資料開放新世代～ 
 陰陽同框 政治與理想 交錯嘅舞台線上～ 
 一首歌唱到選票都彈起身 塗哥仲要再唱！ 

 Final Chorus
 台北有鋒兄真好！嗨起嚟直到朝早！ 
 榜首到市長嘅進化論 全城都尖叫！ 
 綾小路清隆都點頭 呢進化合乎理想！ 
 「ムリムリ進化論？」唔——呢係鋒兄進化 Show！🔥`
      },
      {
        label: '韓語版',
        url: 'https://api.stormkit.io/volumes/file/QWkaKRAEz78hb6vySRhNcxh9RLZmk76wLrAasF7ZJ2w9OlRkRg==',
        lyrics: `鋒兄進化Show🔥 韓語歌詞
타이베이에 펑셩이 있어서 정말 좋아! 
신나게 즐겨, 도망가지 마! 
차트 1위에서 시장까지, 이 리듬은 미쳤어 (wow) 
투고 형 노래할 때 겸손하지 마, 기자들이 사진 찍고 있어! 
아야코지는 이 인생의 장면이 S급 애니 대본 같다고 해~ 

37살 때 나는 고등고시 3급에서 1등을 차지했어 (yeah) 
정보 처리 한판으로 이름 날리고, 코드가 전설이 되었어~ 
시대의 화면 빛을 통해, 꿈은 알고리즘처럼 달려 (run) 
52살, 부시장 대리시장으로 바쁘게 활동 중! (yo) 

투고 형이 감히 “펑셩이 있어서 좋아”라고 노래해 
예비가 바로 본선, 매 순간 중요~ 
안 부르면 자격 박탈, 웃음 
진화는 운이 아니라 신호에 달려 있어! 

타이베이에 펑셩이 있어서 정말 좋아! 
신나게 즐겨, 도망가지 마! 
차트 1위에서 시장까지, 운명은 디버그처럼 폭발! 
투고 형 목소리 폭발, 관중 다 같이 합창! 
“대리”는 잠시일 뿐, 시민 마음속은 이미 알고 있어! 

2040년 밤, 네온이 시청까지 빛나 
선거 슬로건은 ACG 오프닝 같아 
“불가능하다고 말하지 마, 펑셩은 진화야!” 
AI로 보조하는 행정, 데이터 공개 새 시대~ 

음양 동시 등장, 정치와 이상, 무대에서 교차~ 
한 곡으로 투표까지 뛰게 하고, 투고 형은 또 노래해! 

타이베이에 펑셩이 있어서 정말 좋아! 
아침까지 신나! 
차트 1위에서 시장까지 진화론, 도시 전체가 환호! 
아야코지도 고개 끄덕, 이 진화는 이상에 부합해! 
“불가능 진화론?” 아니야—이건 펑셩 진화 쇼! 🔥`
      }
      ,
      {
        label: '中文版 (SpongeBob SquarePants)',
        url: 'https://api.stormkit.io/volumes/file/qSSTa184MedR4mgHa89mNk3cJjecA8d3DWBCX9_dFUq6g8Y81Q=='
      },
      {
        label: '中文版 (Sidhu)',
        url: 'https://api.stormkit.io/volumes/file/Rkc6J3xVDE6N0zl8QUmK2DuThtV6ev6UmT7Svciz4SeevNkhzQ=='
      },
      {
        label: '中文版 (Rose)',
        url: 'https://api.stormkit.io/volumes/file/aKwYy7ZTNo2z8CKgIGCAhl4gUKfzT52h84u8OAazqIZimpNZJQ=='
      },
      {
        label: '中文版 (Pekora)',
        url: 'https://api.stormkit.io/volumes/file/2oY8Lg-P8VxeyBqOrrhD44Ms8aRF0S8ere9DnO6JeL3x_PTc_g=='
      },
      {
        label: '中文版 (Hatsune Miku)',
        url: 'https://api.stormkit.io/volumes/file/uOrpSUUckeF1Kx6A-3bNo9PpRtS1HIv1zi2b6AkXJOoEX_D2Pw=='
      },
      {
        label: '中文版 (Freddie Mercury)',
        url: 'https://api.stormkit.io/volumes/file/vQA5mE96OVPHePOYqWlzxDDgnjztuIMsqeYElO5SfdOOFrDH7Q=='
      },
      {
        label: '中文版 (Donald Trump)',
        url: 'https://api.stormkit.io/volumes/file/M0eMKnJdGV0SxLvSnIRtPq746DCY_L9bbzFnBS5bI12_bf8zwg=='
      }
    ],
    content: `Hook（標注） 
 台北有鋒兄真好！ 
 嗨起來別逃跑！ 
 從榜首進化到市長, 這節奏太離譜（wow） 
 塗哥唱歌別裝低調, 記者都在拍照！ 

 Verse 1（標注） 
 37歲那年我高考三級奪榜首（yeah） 
 資訊處理一戰成名　程式都寫成傳說～ 
 52歲副市長代理市長上陣忙！（yo） 

 Chorus（標注） 
 台北有鋒兄真好！ 
 嗨起來別逃跑！ 
 從榜首進化到市長, 命運像 debug 一樣爆！ 
 塗哥嗓門開到爆表, 全場跟著大合唱！ 

 Verse 2（標注） 
 2040那年的夜　霓虹閃爍到市政廳 
 競選標語像 ACG 的 opening 
 「別說不可能, 鋒兄就是 evolution！」 

 Final Chorus（標注） 
 台北有鋒兄真好！ 
 嗨起來直到早朝！ 
 榜首到市長的進化論　全城都在尖叫！ 
 這是鋒兄進化 Show！🔥`
  },
  { 
    name: '史上最瞎結婚理由', 
    audios: [
      {
        label: '中文版',
        url: 'https://api.stormkit.io/volumes/file/yN2rDWvqYI4UIFcJi6z0UPbqT0jX5zIQjYyf2jq5rElsYsL5Lw==',
        lyrics: `Intro（標註） 
 鋒兄啊你說真的還假的 
 塗哥聽了都快笑翻了 

 Verse 1（標註） 
 鋒兄說要結婚理由只有一個 
 今彩五三九開獎那天 
 頭獎號碼是思敏給的 
 看著獎金直直落心也跟著被收編 

 Chorus（標註） 
 史上最瞎結婚理由 
 今彩五三九牽紅線牽這麼兇 
 一個思敏一個蕙瑄 
 號碼一簽兩人都中頭獎圈 

 Bridge（標註） 
 愛情是運氣還是數學題 
 笑到哭都只能說一句 
 最瞎最瞎但又有點甜蜜 

 Outro（標註） 
 鋒兄牽著思敏塗哥牽著蕙瑄 
 喝喜酒的人一桌一桌還在笑這兩段緣 
 最瞎結婚理由結果都開成頭獎 
 如果幸福也能這樣瞎忙 
 那我明天也去買一張`
      },
      {
        label: '英文版',
        url: 'https://api.stormkit.io/volumes/file/izdJCf5J_QfS-NsfGL-u43YJ623K5QSQ-fi3kdzqkWY8fsCs-A==',
        lyrics: `Intro 
 Brother Feng, are you serious or joking? 
 Brother Tu is laughing so hard 
 
 Verse 1 
 Brother Feng says there's only one reason to marry 
 On the day of the lottery draw 
 The winning numbers were given by Simin 
 Watching the jackpot fall, his heart was captured too 
 
 Chorus 
 The most ridiculous reason to marry 
 The lottery brought them together so strong 
 One Simin, one Huixuan 
 Both won the jackpot with their numbers 
 
 Outro 
 Brother Feng with Simin, Brother Tu with Huixuan 
 Wedding guests laughing at these two stories 
 Most ridiculous marriage reasons turned into jackpots 
 If happiness can be this absurd 
 Then I'll buy a ticket tomorrow too`
      },
      {
        label: '日語版',
        url: 'https://api.stormkit.io/volumes/file/_Ouvryy2-NonpXyszj3muosCbgiuKkh0FCnB4etiGzlm5g3_Ng==',
        lyrics: `Intro 
 鋒兄、マジで？ウソでしょ？ 
 塗哥は聞いてて笑いが止まらないよ 
 
 Verse 1 
 鋒兄は言う、結婚理由は一つだけ 
 今彩539の抽選日 
 一等番号は思敏がくれた 
 賞金を見て、心まで奪われて 
 
 Chorus 
 史上最も馬鹿げた結婚理由 
 今彩539が結んだ赤い糸がこんなに強い 
 一人は思敏、一人は蕙瑄 
 番号一つで二人とも一等当選 
 
 Outro 
 鋒兄は思敏を連れ、塗哥は蕙瑄を連れ 
 披露宴の客たちはテーブルごとにこの二つの縁で笑ってる 
 最も馬鹿げた結婚理由が一等賞に 
 もし幸福がこんなに馬鹿げていたら 
 私も明日買いに行こうかな`
      },
      {
        label: '粵語版',
        url: 'https://api.stormkit.io/volumes/file/KEWUQEoSdtuYtSR_KTg4nLRIQvY-HSnN8b0Uo5qsJlx89nFe1g==',
        lyrics: `Intro 
 阿鋒你講真定假 
 阿塗聽咗都快笑死 
 
 Verse 1 
 阿鋒話結婚理由得一個 
 今期五三九攪珠嗰日 
 頭獎號碼係思敏畀嘅 
 睇住獎金跌落心都一齊俾收編 
 
 Chorus 
 史上最瞎結婚理由 
 今期五三九紅線牽得幾狠 
 一個思敏一個蕙瑄 
 號碼一簽兩個都中頭獎圈 
 
 Outro 
 阿鋒拉住思敏阿塗拉住蕙瑄 
 飲喜酒嘅人一桌一桌 
 仲係笑緊呢兩段緣 
 最瞎結婚理由結果都開成頭獎 
 如果幸福都可以咁瞎忙 
 咁我聽日都去買一張`
      }
      ,
      {
        label: '韓語版',
        url: 'https://api.stormkit.io/volumes/file/zsLP6JxyWRSCA1H8_cHcUQs53qom7MWlkZGICb9pbSs7iXaFOg==',
        lyrics: `Intro（표시） 
펑형아, 너 진짜야? 아니야? 
투哥 듣고 거의 웃음 터질 뻔했어 
 
Verse 1（표시） 
펑형이 결혼하겠다는 이유는 딱 하나 
오늘의 539 복권 당첨일 
1등 번호는 시민이 준 거야 
상금을 보며 마음도 함께 편입됐네 
 
Chorus（표시） 
역대 최웃긴 결혼 이유 
오늘의 539가 이렇게 빨리 인연을 이어줘 
하나는 시민, 하나는 휘현 
번호 하나로 두 사람 모두 1등 당첨 
 
Bridge（표시） 
사랑은 운일까, 아니면 수학 문제일까 
웃다가 울어도 한마디밖에 못 해 
가장 웃기지만, 조금 달콤해 
 
Outro（표시） 
펑형은 시민과, 투哥는 휘현과 
축하주 마시는 사람들 테이블마다 아직도 웃어 
최웃긴 결혼 이유, 결국 모두 1등 당첨 
행복도 이렇게 바쁘게 올 수 있다면 
그럼 나도 내일 한 장 사야겠다`
      }
      ,
      {
        label: '中文版 (SpongeBob SquarePants)',
        url: 'https://api.stormkit.io/volumes/file/5uThAvGu0Hkqb7TrSA3DK4cqoCUmnuXU4ttPPcaI3ywCbV0bkA=='
      },
      {
        label: '中文版 (Sidhu)',
        url: 'https://api.stormkit.io/volumes/file/jGEDWbnUXPfRF1gyLiyPGuDTZegLH9flTV6xtsqEEfNT8jiKGw=='
      },
      {
        label: '中文版 (Rose)',
        url: 'https://api.stormkit.io/volumes/file/nX4onrAv5sDyDC8taLz7oIQ5Tj85DnRW-Y8-oz3AUotASqttRQ=='
      },
      {
        label: '中文版 (Pekora)',
        url: 'https://api.stormkit.io/volumes/file/ovPIJs8dZ1dvNQB35saIWG4i4zOMTTGNzw0zaq6UHxh0n1NFIA=='
      },
      {
        label: '中文版 (Hatsune Miku)',
        url: 'https://api.stormkit.io/volumes/file/DG1fnmOZhK6ub-Bu8dgFhTcJ_TJPkfL38o5_VBIVk8SgwlVMsg=='
      },
      {
        label: '中文版 (Freddie Mercury)',
        url: 'https://api.stormkit.io/volumes/file/GLj3f7FBKyRMrRcl1oIL9UmjYqA7G6-dWGv1XesuhUU3yn1yHg=='
      },
      {
        label: '中文版 (Donald Trump)',
        url: 'https://api.stormkit.io/volumes/file/KqJOf9haetgfOn8ze2pmjDS4tGGaJ1AElcZ4mXLXb99IXs-MUQ=='
      }
    ],
    content: `Intro（標註） 
 鋒兄啊你說真的還假的 
 塗哥聽了都快笑翻了 

 Verse 1（標註） 
 鋒兄說要結婚理由只有一個 
 今彩五三九開獎那天 
 頭獎號碼是思敏給的 
 看著獎金直直落心也跟著被收編 

 Chorus（標註） 
 史上最瞎結婚理由 
 今彩五三九牽紅線牽這麼兇 
 一個思敏一個蕙瑄 
 號碼一簽兩人都中頭獎圈 

 Bridge（標註） 
 愛情是運氣還是數學題 
 笑到哭都只能說一句 
 最瞎最瞎但又有點甜蜜 

 Outro（標註） 
 鋒兄牽著思敏塗哥牽著蕙瑄 
 喝喜酒的人一桌一桌還在笑這兩段緣 
 最瞎結婚理由結果都開成頭獎 
 如果幸福也能這樣瞎忙 
 那我明天也去買一張` 
  },
  { 
    name: '塗哥水電王子爆紅', 
    audios: [
      {
        label: '中文版',
        url: 'https://api.stormkit.io/volumes/file/XBssuVRKo5m6MqWyZRoyWWcHhms5Zcb2_Cfw3ihs2cIAWO1BBQ==',
        lyrics: `故事開始（標註） 
 西元兩零零四年六月十五日，這一天是國中畢業生可以在畢業紀念冊留下紀念簽名的一天，同時也是我們故事主角塗神：塗三傑――江湖人稱塗哥一切的開始。 
 
 台中小吃店對話（標註） 
 塗哥人在台中小吃店，同行（姓同名行，塗哥師傅）指著電視畫面說台北爆發學運太陽花學運，塗哥說我不懂政治，等一下我們去買太陽餅。我聽鋒兄說彰化盛產向日葵，下個月我們去彰化農場踏青，同行職業病發作對農場施工頭頭是道。 
 
 鋒兄歷史小學堂（標註） 
 鋒兄歷史小學堂林學徒說AI機器人有可能取代水電工，我好焦慮喔，塗哥說可是我聽鋒兄說那是未來不是現在，先作好手邊的工作，當一天和尚撞一天鐘。 
 
 副市長同學（標註） 
 塗哥說我有個同學在台北當副市長，同行回你是說鋒兄嗎，鋒兄？！怎麼可能，鋒兄現在是青木瓜手搖飲區域經理，副市長是黃馨鋒，同行說我還以為是鋒兄，一樣名字有個鋒字。對了你那同學不出來選台北市長嗎？塗哥說我同學寫了一本有關於水電工的書，他說銷售量超過兩百五十萬冊，才有出來選的本錢。 
 
 動物園快閃（標註） 
 有人在台北動物園快閃唱動物園不得了了，蠟筆小新？！塗哥說我不懂日語，等一下我們去KTV唱快樂天堂。 
 
 電視劇熱潮（標註） 
 塗董，最近的電視劇很火你有在看嗎，水電情？！聽說原型人物是塗偉傑，塗偉傑？！我叫塗三傑，姓名只差一個字，說不定是我遠房親戚，真的假的，你們塗家壟斷水電這一行業太誇張了吧。 
 
 現象級成功（標註） 
 塗董，你知道塗偉傑紅到被寫進高職國文課本這件事嗎，哇操，塗偉傑肯定是我遠房親戚，傻眼貓咪，我看鋒兄家的貓都會傻眼現象級水電工塗哥人物專訪。 
 
 衍生作品帝國（標註） 
 塗神衍生作品王子高職國文課本 水電電視劇 愛上水電工 主題曲鋒兄作詞 小說名場景 青木瓜四木飲冠名播出 鋒兄和塗哥喝青木瓜四木飲一年份喝到吐電影 水電工大老闆。 
 
 學術引用（標註） 
 學術引用 社會學系碩士論文引用 塗神水電王子 二十一世紀前期文學作品所呈現的台灣社會國文學系博士論文引用 塗神水電王子 台灣政治人物代表作家及其作品研究。 
 
 財富成就（標註） 
 塗哥水電王子爆紅 鋒兄賺三百三十三億 塗哥賺三億`
      },
      {
        label: '英文版',
        url: 'https://api.stormkit.io/volumes/file/q-T4UYAZ2UKqp9X5J7kZihgo1GSFf45CS45AIEHYDcDSjaV6Dg==',
        lyrics: `The Beginning 
 On June 15, 2004, this day marks when junior high school graduates could leave commemorative signatures in their yearbook, and it was also the beginning of everything for our story's protagonist, Tu Shen: Tu Sanjie, later known as Tu Ge. 
 
 Conversation at Taichung Snack Shop 
 Tu Ge was at a small snack shop in Taichung. His companion, Tong Xing (known as Tu Ge's master, same surname and name), pointed at the TV and mentioned the outbreak of the Sunflower Movement in Taipei. Tu Ge replied, "I don't understand politics; let's go buy some sun cakes." He heard from Feng Xiong that Changhua is abundant in sunflowers, and next month they planned a day trip to a farm in Changhua. Tong's occupational habits kicked in, discoursing expertly on farm construction. 
 
 Feng Xiong's Little History Class 
 Lin, the apprentice, said AI robots might replace electricians. "I'm so anxious," Lin said. Tu Ge reassured, "But I heard Feng Xiong say that's the future, not now. First, let's focus on our work at hand: take life one step at a time." 
 
 The Deputy Mayor Classmate 
 Tu Ge mentioned having a classmate who serves as deputy mayor in Taipei. Tong replied, "Are you talking about Feng Xiong?" "Feng Xiong?! That's impossible. Feng Xiong is now the regional manager of a green papaya drink franchise. The deputy mayor is Huang Xingfeng," Tong said. "I thought it was Feng Xiong; they both have 'Feng' in their names. Anyway, is your classmate not running for mayor?" Tu Ge said, "My classmate wrote a book about electricians that sold over 2.5 million copies, so he has the capability to run for office." 
 
 Zoo Flash Mob 
 Someone did a flash mob at the Taipei Zoo, singing about the zoo's wonders. "Shin-chan?!" Tu Ge said, "I don't speak Japanese; let's head to the KTV to sing 'Paradise'." 
 
 TV Drama Craze 
 Chairman Tu, have you been watching the recent hit drama? 'The Love of an Electrician?!' I heard it's based on Tu Weijie's true story. "Tu Weijie?! My name is Tu Sanjie, just one character off; he might be my distant relative. Really? Your Tu family dominating the electrician industry is outrageous!" 
 
 Phenomenal Success 
 Chairman Tu, do you know Tu Weijie's fame reached the point of being included in vocational school literature textbooks? "Holy moly, Tu Weijie must be my distant relative. Shocked like a cat. Even Feng Xiong's cat would be shocked!" 
 
 Derivative Works Empire 
 Tu Shen's Derivative Works Prince: Vocational Literature Textbooks - Electricians, TV Drama Theme Song: 'Falling in Love with an Electrician' Lyrics by Feng Xiong. Famous scenes from the novel sponsored by Papaya Fourwood Drink, Feng Xiong and Tu Ge drank a year's supply until they were sick. Film: The Electrician Tycoon. 
 
 Academic Citation 
 Academic Citation: Sociology Master's Thesis Citing "Tu Shen Electrician Prince" - Early 21st Century Literary Presentation of Taiwanese Society. Chinese Literature Ph.D. Dissertation Citing "Tu Shen Electrician Prince" - A Study of Representative Taiwanese Political Figures and Their Works. 
 
 Financial Achievement 
 Tu Ge's Phenomenal Rise: Feng Xiong made three hundred and thirty-three billion, Tu Ge made three billion`
      },
      {
        label: '日語版',
        url: 'https://api.stormkit.io/volumes/file/eN3ese-QPHlgHn_ohYLEMD-ayYX_FD2RBvvtlWH3kAodbJZHTQ==',
        lyrics: `2004年6月15日、この日は中学校の卒業生が年鑑に記念のサインを残せる日であり、物語の主人公、塗神こと塗三杰（後に塗哥として知られる）の全ての始まりでした。塗哥は台中の小さなスナックショップにいました。彼の仲間である通行（塗哥の師匠。同じ姓と名）はテレビを指差し、台北でのひまわり運動の勃発について言及しました。 
 塗哥は「政治のことはよくわからない。菓子を買いに行こう」と答えました。彼は馮兄から、彰化にはひまわりがたくさんあると聞き、来月に彰化の農場への日帰り旅行を計画していました。通の職業習慣が作動し、農場建設について専門的に話し合いました。馮兄の小さな歴史クラスリンの弟子は、「ロボットが電気工を置き換えるかもしれない」と言いました。 
 
 「とても不安だ」とリンは言いました。塗哥は「でも、馮兄によれば、それは未来のことだ、今ではない。まずは手元の仕事に集中しよう。一歩ずつ生きていこう」と安心させました。塗哥は彼の同級生が台北の副市長を務めていると述べました。通は、「馮兄のことを話しているの？」と答えました。「馮兄？！それはありえない。馮兄は今、青パパイヤドリンクフランチャイズの地域担当マネージャーだ。 
 副市長は黄興豊だ」と通は言いました。「馮兄だと思ったけど、彼らはどちらも『豐』が名前にあるんだ。いずれにせよ、あなたの同級生は市長選に出馬しないのか？」塗哥は、「私の同級生は電気工についての本を書いて、250万部以上売れたから、政治家になる能力も持っています」と言いました。誰かが台北動物園でフラッシュモブをして、動物園の素晴らしさを歌いました。 
 
 「しんちゃん？！」塗哥は、「日本語は話せない。KTVに行って『パラダイス』を歌いに行こう」と言いました。塗会長、最近のヒットドラマをご覧になりましたか？『電気工の愛』ですか？！それは塗偉傑の真実を基にしています。「塗偉傑？！私の名前は塗三杰、あと一文字しかない。彼は私の遠い親戚かも。ほんとに？あなたの塗家が電気工業界を支配しているのはとんでもないことだ！ 
 」塗会長、塗偉傑の名声が職業学校の文学の教科書に載るほどになったことをご存知ですか？「おお、塗偉傑は私の親戚かもしれない。猫をびっくりさせるような衝撃。馮兄の猫もびっくり！」電気工塗哥の驚異的なインタビュー塗神の派生作品プリンス職業文学教科書 - 電気工テレビドラマ主題歌：『電気工に恋して』 作詞：馮兄。 
 
 有名なシーンはパパイヤ・フォーウッド・ドリンクの協賛で、馮兄と塗哥は1年間の供給を飲んで病気になりました。映画：電気工大君学術引用:「塗神電気工プリンス」を引用した社会学修士論文 - 21世紀初頭の台湾社会文学のプレゼンテーション中国文学の博士論文は「塗神電気工プリンス」を引用しています - 台湾の代表的な政治人物とその作品の研究塗哥の驚異的な躍進：馮兄は三千三百三十三億を稼ぎ、塗哥は三億を稼ぎました。`
      },
      {
        label: '粵語版',
        url: 'https://api.stormkit.io/volumes/file/g1JiPViTMc6aH1RRrnaNyisVCPFYA1Ti4M4mD6Yz6exPP7OXoQ==',
        lyrics: `2004年6月15日，呢日係中學畢業生喺年鑑度留紀念簽名嘅日子，都係故仔個主角，塗神即係塗三杰（之後畀人叫塗哥）嘅一切開始。塗哥喺台中一間細細嘅零食店入面。佢嘅朋友通行（塗哥嘅師傅。同姓同名）指住電視，提到台北嘅太陽花運動爆發。塗哥話：「政治我唔係好識。不如買零食去啦。」佢從馮兄度聽到彰化有好多向日葵，計劃下個月去彰化個農場一日遊。 
         
 通職業病發作，專業咁同佢傾農場建設。馮兄嘅細歷史堂阿麟嘅徒弟話：「可能啲機械人會取代電工。」阿麟話：「真係好擔心。」塗哥就話：「不過，馮兄話，呢啲係未來果陣嘅事，宜家仲未到。好似佢講咁，專心做宜家嘅嘢，慢慢一步一腳印咁過日子。」塗哥提起佢嘅同學做緊台北嘅副市長。通問：「你講緊馮兄咩？」通話：「馮兄？！ 
          
 冇可能。馮兄而家係青木瓜汁加盟店嘅區域經理。副市長係黃興豐。」塗哥話：「我以為係馮兄，但佢哋個名都有『豐』。不過，你個同學會唔會選市長？」塗哥話：「我個同學寫咗本關於電工嘅書，賣咗過250萬本，所以佢其實都可以做個政客。」有人喺台北動物園做咗個快閃，唱咗首讚美動物園嘅歌。「新仔？！」塗哥話：「我唔識講日文。 
          
 不如去KTV唱《天堂》啦。」塗會長，最近你有冇睇過嗰齣人氣戲劇呀？就係《電工之愛》！呢齣戲係根據塗偉傑嘅故事改編。「塗偉傑？！我叫塗三杰啫，淨多個字，可能真係遠親喇。真係嗎？你哋塗家喺電工業界咁巴閉真係好夠晒威呀！」塗會長，你知唔知塗偉杰嘅名氣已經去到職業學校嘅文學課本入面呢？「哦，如果塗偉杰真係我親戚，咁咪真係夠晒轟動，連馮兄嘅貓都會嚇親！ 
          
 」塗電工嘅驚人訪問塗神嘅延伸作品王子職業文學課本：電工電視劇主題曲：《愛上電工》填詞：馮兄。有名嘅場景就係綠木瓜汁贊助，馮兄同塗哥飲到供應一年，飲到唔舒服。電影：電工大君學術引用：「塗神電工王子」出現喺社會學碩士論文入面 - 21世紀初台灣社會文學嘅呈現中國文學博士論文都有引述「塗神電工王子」 - 研究台灣嘅代表人物同佢哋嘅作品塗哥驚人嘅騰飛：馮兄賺咗三千三百三十三億，而塗哥賺咗三億。`
      },
      {
        label: '韓語版',
        url: 'https://api.stormkit.io/volumes/file/iMpSXWx_vwfSH7bDosIqMe6wsM6XeG5I3TPtPswYuJ7UkOdA3A==',
        lyrics: `스토리 시작 (故事開始)
서기 2004년 6월 15일, 이날은 중학교 졸업생들이 졸업기념책에 사인을 남길 수 있는 날이자, 이야기 주인공 투신: 투삼걸―江湖 사람들은 그를 ‘투哥’라 부르는 그의 모든 것이 시작되는 날이었다. 

타이중 분식점 대화 (台中小吃店對話)
투哥는 타이중 분식점에 있었고, 동행(성은 같지만 다른 사람, 투哥 스승)이 TV 화면을 가리키며 “타이베이에서 학생 운동, 해바라기 운동이 터졌어”라고 말했다. 
투哥: “나 정치 잘 몰라, 잠시 후 우리 해바라기빵 사러 가자.” 
나는 풍형에게 들었다. “장화는 해바라기 생산이 많대. 다음 달에 장화 농장으로 소풍 가자.” 
동행: 직업병 발동, 농장 공사 경험 풍부. 

풍형 역사 소학당 (鋒兄歷史小學堂)
풍형 역사 소학당, 임습생이 말하길 “AI 로봇이 전기·배관 일을 대신할 수도 있어요, 너무 불안해요.” 
투哥: “하지만 풍형이 말했잖아, 그건 미래지금은 아니야. 지금 손에 있는 일이나 잘 하자, 하루를 스님처럼 충실히 살아라.” 

부시장 동창 (副市長同學)
투哥: “내 친구 한 명이 타이베이 부시장이야.” 
동행: “풍형 말하는 거야?” 
투哥: “아니, 풍형은 지금 청목과 손음료 지역 매니저야. 부시장은 황쉰펑.” 
동행: “나는 풍형인 줄 알았어, 이름에 ‘펑’ 글자가 같네. 너 친구, 타이베이 시장 선거 안 나가?” 
투哥: “내 친구, 전기·배관 관련 책 한 권 썼어. 250만 부 넘게 팔렸어. 그럼 선거 나갈 수 있는 자본이 생기지.” 

동물원 플래시몹 (動物園快閃)
타이베이 동물원에서 누군가 플래시몹으로 노래를 불렀다. 
투哥: “나는 일본어 몰라, 잠시 후 우리 KTV 가서 ‘행복천국’ 노래 부르자.” 

드라마 열풍 (電視劇熱潮)
투동: “최근 드라마 인기 많아요, 보고 있어요? ‘전기·배관 러브’?” 
투삼걸: “원형 인물이 투위제라고? 나는 투삼걸인데, 이름 한 글자 차이네. 혹시 먼 친척일지도, 진짜야?” 
“너희 투 가문이 전기·배관 산업 장악 너무 심하다.” 

현상급 성공 (現象級成功)
투동: “투위제가 고등직업학교 국문 교과서에 실렸다는 거 알아?” 
투삼걸: “와, 투위제는 분명 먼 친척일 거야. 깜짝 놀랐네. 풍형 집 고양이도 깜짝 놀라는 현상급 전기·배관 왕 투哥 인물 인터뷰.” 

파생 작품 제국 (衍生作品帝國)
투신 파생 작품: 

왕자 고등직업학교 국문 교과서 
전기·배관 드라마 
‘전기공 사랑에 빠지다’ 주제가 풍형 작사 
소설 명장면 청목과 사목 음료 후원 
풍형과 투哥 1년치 음료 마셔서 토할 정도 영화 
전기·배관 업계 큰손 

학술 인용 (學術引用)
사회학 석사 논문 인용: ‘투신 전기왕자’ 
21세기 전기 문학 작품에서 나타난 대만 사회 
국문학 박사 논문 인용: ‘투신 전기왕자, 대만 정치인 대표 작가 및 작품 연구’ 

재산과 성취 (財富成就, 韓語)
투哥 전기왕자 폭발적 인기, 풍형 3,330억 원 벌다, 투哥 3억 원 벌다.`
      }
      ,
      {
        label: '中文版 (SpongeBob SquarePants)',
        url: 'https://api.stormkit.io/volumes/file/xojZL_U_ETCCRPszx9hyoqLp8sgxCg-HR9vBHIM0eFEaXbS2OQ=='
      },
      {
        label: '中文版 (Sidhu)',
        url: 'https://api.stormkit.io/volumes/file/SJ6ii_X2m3xAPYo0zW6jm5XSQ4njKoFwjTdoG4i5lKkZcxG4Mg=='
      },
      {
        label: '中文版 (Rose)',
        url: 'https://api.stormkit.io/volumes/file/YXmW9xi94DNgiLm4Iqn2TeKx3hmhaDw5IgFSmc5LcDXPIMSPjA=='
      },
      {
        label: '中文版 (Pekora)',
        url: 'https://api.stormkit.io/volumes/file/LbEk1WJx7b-z0LDq5cGGFAmS8tjPIjd_M2xx8mtUlMM7DLQmtQ=='
      },
      {
        label: '中文版 (Hatsune Miku)',
        url: 'https://api.stormkit.io/volumes/file/DVB0ejTxvt79-pnGkURkAvpQGSs4J3DFY1TVVfCAYGziwH807w=='
      },
      {
        label: '中文版 (Freddie Mercury)',
        url: 'https://api.stormkit.io/volumes/file/bBOPsrWF5gLSxnbU0PX2GsaAB2Q38vtf79i9rQZhZItu1xgL9g=='
      },
      {
        label: '中文版 (Donald Trump)',
        url: 'https://api.stormkit.io/volumes/file/jSRNCGdDII6OG2RWIfgE_hbt4bdiHC01vgtx0FZo_CS8D-Mqfw=='
      }
    ],
    content: `故事開始（標註） 
 西元兩零零四年六月十五日，這一天是國中畢業生可以在畢業紀念冊留下紀念簽名的一天，同時也是我們故事主角塗神：塗三傑――江湖人稱塗哥一切的開始。 
 
 台中小吃店對話（標註） 
 塗哥人在台中小吃店，同行（姓同名行，塗哥師傅）指著電視畫面說台北爆發學運太陽花學運，塗哥說我不懂政治，等一下我們去買太陽餅。我聽鋒兄說彰化盛產向日葵，下個月我們去彰化農場踏青，同行職業病發作對農場施工頭頭是道。 
 
 鋒兄歷史小學堂（標註） 
 鋒兄歷史小學堂林學徒說AI機器人有可能取代水電工，我好焦慮喔，塗哥說可是我聽鋒兄說那是未來不是現在，先作好手邊的工作，當一天和尚撞一天鐘。 
 
 副市長同學（標註） 
 塗哥說我有個同學在台北當副市長，同行回你是說鋒兄嗎，鋒兄？！怎麼可能，鋒兄現在是青木瓜手搖飲區域經理，副市長是黃馨鋒，同行說我還以為是鋒兄，一樣名字有個鋒字。對了你那同學不出來選台北市長嗎？塗哥說我同學寫了一本有關於水電工的書，他說銷售量超過兩百五十萬冊，才有出來選的本錢。 
 
 動物園快閃（標註） 
 有人在台北動物園快閃唱動物園不得了了，蠟筆小新？！塗哥說我不懂日語，等一下我們去KTV唱快樂天堂。 
 
 電視劇熱潮（標註） 
 塗董，最近的電視劇很火你有在看嗎，水電情？！聽說原型人物是塗偉傑，塗偉傑？！我叫塗三傑，姓名只差一個字，說不定是我遠房親戚，真的假的，你們塗家壟斷水電這一行業太誇張了吧。 
 
 現象級成功（標註） 
 塗董，你知道塗偉傑紅到被寫進高職國文課本這件事嗎，哇操，塗偉傑肯定是我遠房親戚，傻眼貓咪，我看鋒兄家的貓都會傻眼現象級水電工塗哥人物專訪。 
 
 衍生作品帝國（標註） 
 塗神衍生作品王子高職國文課本 水電電視劇 愛上水電工 主題曲鋒兄作詞 小說名場景 青木瓜四木飲冠名播出 鋒兄和塗哥喝青木瓜四木飲一年份喝到吐電影 水電工大老闆。 
 
 學術引用（標註） 
 學術引用 社會學系碩士論文引用 塗神水電王子 二十一世紀前期文學作品所呈現的台灣社會國文學系博士論文引用 塗神水電王子 台灣政治人物代表作家及其作品研究。 
 
 財富成就（標註） 
塗哥水電王子爆紅 鋒兄賺三百三十三億 塗哥賺三億` 
  },
  {
    name: '鋒兄的傳奇人生',
    audios: [
      {
        label: '中文版',
        url: 'https://api.stormkit.io/volumes/file/4gTSWVpLDlPDA1V0nw9fMb3cNBelwn8GRKwqONCuQQt2mGSP2A==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '英文版',
        url: 'https://api.stormkit.io/volumes/file/PXcfN03hMcmX0Za1KFnkNvnW9dLDktRjx6LSlQIjEiUEFQA7dw==',
        lyrics: `Feng's Legendary Life 
From the jackpot to the top 
From the top to the president 
At thirty-seven, 
Winner of the Special Prize in the Receipt Lottery 
Winner of the Power Lottery Jackpot 
Winner of the Grand Lottery Jackpot 
Top of the third-level civil service exam in information processing 
Declined to report 
Feng's PR and Information Firm 
Started a business 
At fifty-one, 
Director of Information for Taipei City 
At fifty-two, 
Deputy Secretary-General of Taipei City 
At fifty-three, 
Deputy Mayor of Taipei City 
At fifty-four, 
Mayoral candidate of Taipei City 
Billion-dollar Mayor 
Feng made a fortune 
Lucky Taipei 
At sixty-three, 
Presidential candidate 
Trillion-dollar President 
Feng made a fortune 
Lucky Taiwan 
Feng's Legendary Life 
From the jackpot to the top 
From the top to the president`
      },
      {
        label: '日文版',
        url: 'https://api.stormkit.io/volumes/file/ukPtjTsHsx_XetAI2q_XIaPLZ5jdevOefYhprhNzwR7dRs0ywQ==',
        lyrics: `鋒兄の伝説的人生 
最初の賞からトップへ 
トップから大統領へ 
37歳 
統一インボイス特別賞受賞者 
パワーボール一等賞受賞者 
ロト一等賞受賞者 
高試三級情報処理トップ 
報到を辞退 
鋒兄 塗哥広報情報 
起業 
51歳 
台北市情報局長 
52歳 
台北市副秘書長 
53歳 
台北市副市長 
54歳 
台北市長候補 
億万市長 
鋒兄 大儲け 
幸運の台北 
63歳 
大統領候補 
兆万大統領 
鋒兄 大儲け 
幸運の台湾 
鋒兄の伝説的人生 
最初の賞からトップへ 
トップから大統領へ`
      },
      {
        label: '韓文版',
        url: 'https://api.stormkit.io/volumes/file/8jppU2ju1-4WKLN6uKzsKCO9KelwEi7rwy5cRZuQgWktMIolHQ==',
        lyrics: `형 형제의 전설적인 인생 
처음부터 1등까지 
1등에서 대통령까지 
서른일곱 살 
복권 특별 상 수상자 
파워볼 1등 수상자 
로또 1등 수상자 
고시 3급 정보 처리 수석 
등록 포기 
형 형제 도끼 홍보 정보 
창업 
쉰한 살 
타이베이시 정보국장 
쉰둘 살 
타이베이시 부비서장 
쉰셋 살 
타이베이시 부시장 
쉰넷 살 
타이베이 시장 후보 
수십억 시장 
형 형제 대박 
행운의 타이베이 
예순셋 살 
대통령 후보 
조 단위 대통령 
형 형제 대박 
행운의 타이완 
형 형제의 전설적인 인생 
처음부터 1등까지 
1등에서 대통령까지`
      },
      {
        label: '粵語版',
        url: 'https://api.stormkit.io/volumes/file/2GwGcv2pgQE3twSLYV9zI0xdcX4wtmyWmA6_mpRFxmlHeDINIA==',
        lyrics: `鋒兄嘅傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄嘅傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Pekora)',
        url: 'https://api.stormkit.io/volumes/file/owh0r27l8RehP-rdqx6VzMvzNQ6DGur0Aa38lLoFudh4Jd-o2A==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Donald Trump)',
        url: 'https://api.stormkit.io/volumes/file/6GtyzFYHMrxuLoGyfJtBzJgO7wJcdlC_etEh2f3BkDEZtQU5sQ==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Hatsune Miku)',
        url: 'https://api.stormkit.io/volumes/file/qWAI3jA_eARUtqDiRJpYuxAprPCn5G7_twJpCXewn08CqgLTPw==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Sidhu)',
        url: 'https://api.stormkit.io/volumes/file/EZfB5NoOCZURvjGa9iWDI6VbkSvQ9XMTNRE7l2MWYFkzN_WDVA==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Freddie Mercury)',
        url: 'https://api.stormkit.io/volumes/file/Qk1bbsC3w3xeUvQS_3jLMuJaFnAsj0f3bbtB3hl_YvfxZ2LODg==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (SpongeBob SquarePants)',
        url: 'https://api.stormkit.io/volumes/file/tf-4bpxgloQVJzaLVdx6VrV8aWopX9waUcfcsrRYRxzUAB2Dmg==',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      },
      {
        label: '中文版 (Rose)',
        url: 'https://api.stormkit.io/volumes/file/cvHAbEnk7DQO7H7W_Y8JTLmXJqsKZ-FcbNKQw7seTyfoYTGkg',
        lyrics: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統 
三十七歲 
統一發票特別獎得主 
威力彩頭獎得主 
大樂透頭獎得主 
高考三級資訊處理榜首 
放棄報到 
鋒兄塗哥公關資訊 
創業 
五十一歲 
台北市資訊局長 
五十二歲 
台北市副秘書長 
五十三歲 
台北市副市長 
五十四歲 
台北市長候選人 
百億市長 
鋒兄發大財 
幸運台北 
六十三歲 
總統候選人 
一兆總統 
鋒兄發大財 
幸運台灣 
鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
      }
      ],
    content: `鋒兄的傳奇人生 
從頭獎到榜首 
從榜首到總統`
  }
]);

const viewLyric = (lyric) => {
  selectedLyric.value = lyric;
};

const closeModal = () => {
  selectedLyric.value = null;
};
</script>

<style scoped>
.page {
  color: var(--color-text);
  display: grid;
  gap: 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding: 1.25rem 1.3rem;
  border-radius: var(--radius-xl);
  background: var(--panel-bg);
  border: 1px solid var(--panel-stroke);
  box-shadow: var(--panel-shadow);
}

.header h2 {
  margin: 0;
  flex: 1;
  min-width: 12rem;
  font-size: clamp(1.45rem, 1.15rem + 0.8vw, 2.2rem);
}

.badge {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(101, 216, 255, 1), rgba(63, 103, 255, 0.82));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #04111f;
  box-shadow: 0 18px 36px rgba(47, 113, 255, 0.22);
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 0.8rem;
}

.toolbar {
  display: flex;
  gap: 0.8rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(151, 191, 255, 0.1);
}

.search {
  flex: 1;
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  border-radius: 1rem;
  background: rgba(7, 12, 26, 0.72);
  color: var(--color-text-strong);
}

.btn {
  padding: 0.82rem 1rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  border-radius: 999px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-strong);
}

.btn.primary {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  border-color: rgba(120, 217, 255, 0.28);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  border: 1px solid var(--panel-stroke);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  background: var(--panel-bg);
  box-shadow: var(--panel-shadow);
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(120, 217, 255, 0.28);
}
.card:active {
  transform: translateY(-1px) scale(0.995);
}

.thumb.lyrics {
  height: 170px;
  background:
    linear-gradient(135deg, rgba(72, 108, 209, 0.44), rgba(13, 18, 34, 0.78)),
    radial-gradient(circle at top right, rgba(93, 186, 255, 0.26), transparent 45%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.thumb.lyrics::after {
  content: '🎵';
}

.meta {
  padding: 1rem 1rem 1.1rem;
}

.name {
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: var(--color-text-strong);
}

.info {
  font-size: 0.76rem;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(4, 8, 18, 0.64);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(14px);
}

.modal-content {
  background: linear-gradient(180deg, rgba(12, 19, 38, 0.96), rgba(6, 10, 22, 0.96));
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 780px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 34px 100px rgba(1, 6, 18, 0.55);
  border: 1px solid rgba(151, 191, 255, 0.16);
  color: var(--color-text);
}

.modal-content h3 {
  margin: 0 0 1rem;
  color: var(--color-text-strong);
}

@media (max-width: 600px) {
  .header {
    flex-wrap: wrap;
  }
  .actions {
    width: 100%;
    margin-top: 0.5rem;
    margin-left: 0;
  }
  .actions .btn {
    width: 100%;
  }
  .cards {
    grid-template-columns: 1fr;
  }
  .toolbar {
    flex-direction: column;
  }
}

.audio-player-section {
  margin-top: 1rem;
  margin-bottom: 0.8rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(151, 191, 255, 0.1);
}

.audio-tabs {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}

.audio-tab {
  padding: 0.55rem 0.85rem;
  border: 1px solid rgba(151, 191, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text);
}

.audio-tab.active {
  background: linear-gradient(135deg, rgba(72, 166, 255, 0.3), rgba(78, 255, 199, 0.18));
  color: var(--color-text-strong);
  border-color: rgba(120, 217, 255, 0.28);
}

.audio-control {
  width: 100%;
  margin-top: 10px;
}

.lyrics-text {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  white-space: pre-wrap;
  line-height: 1.6;
  border: 1px solid rgba(151, 191, 255, 0.1);
}

.lyrics-text pre {
  font-family: inherit;
  white-space: pre-wrap;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}

.no-audio-message {
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 1rem;
  text-align: center;
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .page {
    gap: 0.85rem;
  }

  .header,
  .toolbar,
  .modal-content,
  .audio-player-section,
  .lyrics-text {
    padding-left: 0.95rem;
    padding-right: 0.95rem;
  }

  .modal-content {
    width: calc(100% - 1rem);
    padding-top: 1rem;
    padding-bottom: 1rem;
    max-height: 88vh;
  }

  .thumb.lyrics {
    height: 154px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
