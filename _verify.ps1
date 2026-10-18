$url = 'https://firefly-blog-c91.pages.dev/'
try {
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25
  $title = [regex]::Match($r.Content, '(?si)<title>(.*?)</title>').Groups[1].Value
  $cards = [regex]::Matches($r.Content, '(?si)class="[^"]*post-card').Count
  "STATUS: $($r.StatusCode)  BYTES: $($r.RawContentLength)"
  "TITLE: $title"
  "POST_CARDS: $cards"
  $a = (Invoke-WebRequest -Uri ($url.TrimEnd('/') + '/archive/') -UseBasicParsing -TimeoutSec 20).StatusCode
  "ARCHIVE route: $a"
} catch {
  "ERR: $($_.Exception.Message)"
}
