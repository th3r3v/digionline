Csatorna beallitasok
---

A *.dist.json fajlok frissulnek a program frissitesekor. Ha megfelel az alapbeallitas (csatornasorrend, csatorna szures) akkor
nincs tovabbi teendod.

Ha modositani szeretnel rajta, akkor keszits rola masolatot a '.dist' resz nelkul ugyanebbe a konyvtarba.
Pl.: channel_order.dist.json -> channel_order.json
Ez a fajl nem fog valtozni a frissitesek soran, a lokalis beallitasokra szolgal.
Ha letezik a file akkor azt hasznalja a rendszer, ha nem akkor a .dist.json-okat.
 

---
channel_order.dist.json vagy channel_order.json
---
A beallitott sorrend alapjan jelennek meg a csatornak. 
A csatorna nevek a lekert adatbol jonnek, itt csak az azonosithatosag miatt szerepelnek.


---
channel_hide.dist.json vagy  channel_hide.json
---
A listaban szereplo csatornak nem jelennek meg.
Az elofizeteses csatornakra (Film Now) valtaskor megall a lejatszas, ha nincs ra ervenyes elofizetes.
A channel_order.dist.json filebol atmasolhato az elrejteni kivant csatorna sora.
