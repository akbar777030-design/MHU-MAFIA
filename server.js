// MAFIA MHU — один файл: сервер + клиент. Запуск: node server.js (BOT_TOKEN и PUBLIC_URL в переменных окружения)
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {WebSocketServer}=require('ws');
const TOKEN=process.env.BOT_TOKEN||'',DEV=process.env.DEV==='1',PORT=process.env.PORT||3000;let BOT_LINK=process.env.BOT_LINK||'';const HTML=Buffer.from('PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0icnUiPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4KPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTEsdmlld3BvcnQtZml0PWNvdmVyIj4KPHNjcmlwdCBzcmM9Imh0dHBzOi8vdGVsZWdyYW0ub3JnL2pzL3RlbGVncmFtLXdlYi1hcHAuanMiPjwvc2NyaXB0Pgo8dGl0bGU+TUFGSUEgTUhVPC90aXRsZT4KPHN0eWxlPgo6cm9vdHstLWJnOiMwYTBhMGE7LS1jYXJkOiMxNjEwMTI7LS1yZWQ6I2Q0MTQxYzstLWRrOiM1YTBjMTA7LS1kaW06IzhhNmE2YzstLXR4OiNmMWU2ZTZ9Cip7Ym94LXNpemluZzpib3JkZXItYm94fQpib2R5e21hcmdpbjowO2JhY2tncm91bmQ6dmFyKC0tYmcpO2NvbG9yOnZhcigtLXR4KTtmb250OjE1cHggc3lzdGVtLXVpLHNhbnMtc2VyaWY7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtoZWlnaHQ6MTAwZHZoO3BhZGRpbmctdG9wOmVudihzYWZlLWFyZWEtaW5zZXQtdG9wKX0KaGVhZGVye2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzoxMHB4IDE0cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0tZGspfQpoMXttYXJnaW46MDtmb250LXNpemU6MThweDtsZXR0ZXItc3BhY2luZzozcHg7Y29sb3I6dmFyKC0tcmVkKTt0ZXh0LXNoYWRvdzowIDAgMTBweCB2YXIoLS1kayl9Ci5jb2lue2NvbG9yOiNmZmIzYjN9Cm5hdntkaXNwbGF5OmZsZXh9bmF2IGJ1dHRvbntmbGV4OjE7Ym9yZGVyLXJhZGl1czowO2JvcmRlcjowO2JvcmRlci1ib3R0b206MnB4IHNvbGlkIHRyYW5zcGFyZW50O2JhY2tncm91bmQ6bm9uZTtjb2xvcjp2YXIoLS1kaW0pfQpuYXYgYnV0dG9uLm9ue2NvbG9yOnZhcigtLXJlZCk7Ym9yZGVyLWNvbG9yOnZhcigtLXJlZCl9CmJ1dHRvbixpbnB1dHtmb250OmluaGVyaXQ7Ym9yZGVyLXJhZGl1czo4cHg7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kayk7YmFja2dyb3VuZDp2YXIoLS1jYXJkKTtjb2xvcjp2YXIoLS10eCk7cGFkZGluZzo5cHggMTJweH0KYnV0dG9ue2N1cnNvcjpwb2ludGVyfWJ1dHRvbi5wcml7YmFja2dyb3VuZDp2YXIoLS1yZWQpO2JvcmRlci1jb2xvcjp2YXIoLS1yZWQpO2ZvbnQtd2VpZ2h0OjYwMH0KYnV0dG9uOmRpc2FibGVke29wYWNpdHk6LjR9Cm1haW57ZmxleDoxO292ZXJmbG93OmF1dG87cGFkZGluZzoxMHB4IDE0cHh9Ci5jYXJke2JhY2tncm91bmQ6dmFyKC0tY2FyZCk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kayk7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MTBweDttYXJnaW4tYm90dG9tOjEwcHh9Ci5kaW17Y29sb3I6dmFyKC0tZGltKTtmb250LXNpemU6MTNweH0ucmVke2NvbG9yOnZhcigtLXJlZCl9Ci5ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6OHB4fQoucGx7dGV4dC1hbGlnbjpsZWZ0fS5wbC5zZWx7Ym9yZGVyLWNvbG9yOnZhcigtLXJlZCk7Ym94LXNoYWRvdzowIDAgOHB4IHZhcigtLXJlZCl9LnBsLmRlYWR7b3BhY2l0eTouMzU7dGV4dC1kZWNvcmF0aW9uOmxpbmUtdGhyb3VnaH0KLnJvd3tkaXNwbGF5OmZsZXg7Z2FwOjhweDttYXJnaW4tYm90dG9tOjhweH0ucm93IGlucHV0e2ZsZXg6MTttaW4td2lkdGg6MH0KI2NoYXRib3h7Ym9yZGVyLXRvcDoxcHggc29saWQgdmFyKC0tZGspO3BhZGRpbmc6NnB4IDE0cHggY2FsYyg4cHggKyBlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSkpfQojdGFic3tkaXNwbGF5OmZsZXg7Z2FwOjZweDttYXJnaW4tYm90dG9tOjZweH0jdGFicyBidXR0b257cGFkZGluZzo0cHggMTBweDtmb250LXNpemU6MTNweH0jdGFicyBidXR0b24ub257Ym9yZGVyLWNvbG9yOnZhcigtLXJlZCk7Y29sb3I6dmFyKC0tcmVkKX0KI21zZ3N7aGVpZ2h0OjExMHB4O292ZXJmbG93OmF1dG87Zm9udC1zaXplOjE0cHg7bWFyZ2luLWJvdHRvbTo2cHh9LnN5c3tjb2xvcjp2YXIoLS1kaW0pO2ZvbnQtc3R5bGU6aXRhbGljfS53aG97Y29sb3I6dmFyKC0tcmVkKTtmb250LXdlaWdodDo2MDB9Cjwvc3R5bGU+PC9oZWFkPjxib2R5Pgo8aGVhZGVyPjxoMT5NQUZJQSBNSFU8L2gxPjxzcGFuIGNsYXNzPSJjb2luIiBpZD0iY29pbnMiPvCfqpkgMDwvc3Bhbj48L2hlYWRlcj4KPG5hdj48YnV0dG9uIGRhdGEtdD0iZ2FtZSIgY2xhc3M9Im9uIj7QmNCz0YDQsDwvYnV0dG9uPjxidXR0b24gZGF0YS10PSJzaG9wIj7QnNCw0LPQsNC30LjQvTwvYnV0dG9uPjxidXR0b24gZGF0YS10PSJ0YXNrcyI+0JfQsNC00LDQvdC40Y88L2J1dHRvbj48L25hdj4KPG1haW4gaWQ9Im1haW4iPjwvbWFpbj4KPGRpdiBpZD0iY2hhdGJveCIgaGlkZGVuPjxkaXYgaWQ9InRhYnMiPjwvZGl2PjxkaXYgaWQ9Im1zZ3MiPjwvZGl2Pgo8ZGl2IGNsYXNzPSJyb3ciIHN0eWxlPSJtYXJnaW46MCI+PGlucHV0IGlkPSJpbnAiIG1heGxlbmd0aD0iMzAwIiBwbGFjZWhvbGRlcj0i0KHQvtC+0LHRidC10L3QuNC14oCmIj48YnV0dG9uIGNsYXNzPSJwcmkiIGlkPSJzbmQiPuKepDwvYnV0dG9uPjwvZGl2PjwvZGl2Pgo8c2NyaXB0Pgpjb25zdCB0Zz13aW5kb3cuVGVsZWdyYW0/LldlYkFwcDt0Zz8ucmVhZHkoKTt0Zz8uZXhwYW5kKCk7CmxldCB3cyxTPW51bGwsTUU9bnVsbCxDRkc9e3Nob3A6e319LHRhYj0nZ2FtZScsY2g9J2FsbCc7CmNvbnN0ICQ9aWQ9PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTsKY29uc3QgZXNjPXM9PlN0cmluZyhzKS5yZXBsYWNlKC9bJjw+Il0vZyxjPT4oeycmJzonJmFtcDsnLCc8JzonJmx0OycsJz4nOicmZ3Q7JywnIic6JyZxdW90Oyd9W2NdKSk7CmNvbnN0IFJPTEU9e21hZmlhOifwn6m4INCc0LDRhNC40Y8nLGNpdHk6J9Cc0LjRgNC90YvQuScsZG9jdG9yOifwn5KJINCU0L7QutGC0L7RgCcsc2hlcmlmZjon4q2QINCo0LXRgNC40YQnfTsKY29uc3QgcT1uZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7CmxldCBqb2luQ29kZT10Zz8uaW5pdERhdGFVbnNhZmU/LnN0YXJ0X3BhcmFtfHxxLmdldCgncm9vbScpfHwnJzsKY29uc3Qgc2VuZD1vPT53cyYmd3MucmVhZHlTdGF0ZT09PTEmJndzLnNlbmQoSlNPTi5zdHJpbmdpZnkobykpOwpmdW5jdGlvbiBjb25uZWN0KCl7CiAgd3M9bmV3IFdlYlNvY2tldCgobG9jYXRpb24ucHJvdG9jb2w9PT0naHR0cHM6Jz8nd3NzOi8vJzond3M6Ly8nKStsb2NhdGlvbi5ob3N0KTsKICB3cy5vbm9wZW49KCk9PnNlbmQoe3Q6J2F1dGgnLGluaXQ6dGc/LmluaXREYXRhfHwnJyxkZXY6cS5nZXQoJ3UnKXx8Jycsam9pbjpqb2luQ29kZX0pOwogIHdzLm9ubWVzc2FnZT1lPT57Y29uc3QgbT1KU09OLnBhcnNlKGUuZGF0YSk7CiAgICBpZihtLnQ9PT0nc3RhdGUnKXtTPW0ucztqb2luQ29kZT0nJ31lbHNlIGlmKG0udD09PSdtZScpTUU9bS5tZTtlbHNlIGlmKG0udD09PSdjZmcnKUNGRz1tOwogICAgZWxzZSBpZihtLnQ9PT0nZXJyJyl7dGc/LnNob3dBbGVydD90Zy5zaG93QWxlcnQobS5tKTphbGVydChtLm0pO3JldHVybn0KICAgIHJlbmRlcigpfTsKICB3cy5vbmNsb3NlPSgpPT5zZXRUaW1lb3V0KGNvbm5lY3QsMTUwMCk7IC8vINCw0LLRgtC+0L/QtdGA0LXQv9C+0LTQutC70Y7Rh9C10L3QuNC1OiDRgdC10YDQstC10YAg0LLQtdGA0L3RkdGCINCyINC60L7QvNC90LDRgtGDCn0KZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbmF2IGJ1dHRvbicpLmZvckVhY2goYj0+Yi5vbmNsaWNrPSgpPT57dGFiPWIuZGF0YXNldC50O2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ25hdiBidXR0b24nKS5mb3JFYWNoKHg9PnguY2xhc3NMaXN0LnRvZ2dsZSgnb24nLHg9PT1iKSk7cmVuZGVyKCl9KTsKZnVuY3Rpb24gbG9iYnlIVE1MKCl7cmV0dXJuYDxkaXYgY2xhc3M9Y2FyZD48YiBjbGFzcz1yZWQ+0KHQvtC30LTQsNGC0Ywg0LrQvtC80L3QsNGC0YM8L2I+PGRpdiBjbGFzcz1yb3cgc3R5bGU9Im1hcmdpbi10b3A6OHB4Ij48aW5wdXQgaWQ9cm4gcGxhY2Vob2xkZXI9ItCd0LDQt9Cy0LDQvdC40LUgKNC90LDQv9GALiDQp9CB0KDQndCr0Jkg0J7QotCU0JXQmykiIG1heGxlbmd0aD0yND48YnV0dG9uIGNsYXNzPXByaSBvbmNsaWNrPSJzZW5kKHt0OidjcmVhdGUnLG5hbWU6JCgncm4nKS52YWx1ZX0pIj7QodC+0LfQtNCw0YLRjDwvYnV0dG9uPjwvZGl2PjwvZGl2Pgo8ZGl2IGNsYXNzPWNhcmQ+PGIgY2xhc3M9cmVkPtCS0L7QudGC0Lgg0L/QviDQutC+0LTRgzwvYj48ZGl2IGNsYXNzPXJvdyBzdHlsZT0ibWFyZ2luLXRvcDo4cHgiPjxpbnB1dCBpZD1yYyBwbGFjZWhvbGRlcj0i0JrQntCUIiBtYXhsZW5ndGg9Nj48YnV0dG9uIGNsYXNzPXByaSBvbmNsaWNrPSJzZW5kKHt0Oidqb2luJyxjb2RlOiQoJ3JjJykudmFsdWV9KSI+0JLQvtC50YLQuDwvYnV0dG9uPjwvZGl2PjwvZGl2Pgo8cCBjbGFzcz1kaW0+0JrQvtC80L3QsNGC0Ysg0L3QsCA04oCTMTUg0LjQs9GA0L7QutC+0LIuINCc0LDRhNC40Y86IDEgKDTigJM5KSwgMiAoMTDigJMxMiksIDMgKDEz4oCTMTUpLjwvcD5gfQpmdW5jdGlvbiByb29tSFRNTCgpewogIGNvbnN0IG09Uy5tZSxwaD1TLnBoYXNlLG5pZ2h0PXBoPT09J25pZ2h0JyxkYXk9cGg9PT0nZGF5JzsKICBjb25zdCBsYWI9e2xvYmJ5OifQntC20LjQtNCw0L3QuNC1INC40LPRgNC+0LrQvtCyJyxuaWdodDon8J+MmSDQndC+0YfRjCAnK1MuZGF5LGRheTon4piA77iPINCU0LXQvdGMICcrUy5kYXkrJyDigJQg0LPQvtC70L7RgdC+0LLQsNC90LjQtScsZW5kOifQmNCz0YDQsCDQvtC60L7QvdGH0LXQvdCwOiAnKyhTLndpbm5lcj09PSdjaXR5Jz8n0L/QvtCx0LXQtNC40Lsg0LPQvtGA0L7QtCc6J9C/0L7QsdC10LTQuNC70LAg0LzQsNGE0LjRjycpfVtwaF07CiAgbGV0IGg9YDxkaXYgY2xhc3M9Y2FyZD48YiBjbGFzcz1yZWQ+JHtlc2MoUy5uYW1lKX08L2I+IDxzcGFuIGNsYXNzPWRpbT7QutC+0LQgJHtTLmNvZGV9IMK3ICR7Uy5wbGF5ZXJzLmxlbmd0aH0vMTU8L3NwYW4+CiAgPGRpdiBjbGFzcz1yb3cgc3R5bGU9Im1hcmdpbjo4cHggMCAwIj48YnV0dG9uIG9uY2xpY2s9aW52aXRlKCk+0J/RgNC40LPQu9Cw0YHQuNGC0Yw8L2J1dHRvbj48YnV0dG9uIG9uY2xpY2s9InNlbmQoe3Q6J2xlYXZlJ30pIj7QktGL0LnRgtC4PC9idXR0b24+CiAgJHtTLm93bmVyPT09bS5pZCYmKHBoPT09J2xvYmJ5J3x8cGg9PT0nZW5kJyk/JzxidXR0b24gY2xhc3M9cHJpIG9uY2xpY2s9InNlbmQoe3Q6XCdzdGFydFwnfSkiPtCh0YLQsNGA0YI8L2J1dHRvbj4nOicnfTwvZGl2PjwvZGl2PgogIDxkaXYgY2xhc3M9Y2FyZD48Yj4ke2xhYn08L2I+IDxzcGFuIGNsYXNzPWRpbSBpZD10aW1lcj48L3NwYW4+JHttLnJvbGU/YDxkaXY+0JLQsNGI0LAg0YDQvtC70Yw6IDxiIGNsYXNzPXJlZD4ke1JPTEVbbS5yb2xlXX08L2I+PC9kaXY+YDonJ31gOwogIGlmKG0ubm90ZXM/Lmxlbmd0aCloKz1gPGRpdiBjbGFzcz1kaW0+JHttLm5vdGVzLm1hcChlc2MpLmpvaW4oJzxicj4nKX08L2Rpdj5gOwogIGNvbnN0IGNhbkFjdD1tLmFsaXZlJiYoKG5pZ2h0JiZbJ21hZmlhJywnZG9jdG9yJywnc2hlcmlmZiddLmluY2x1ZGVzKG0ucm9sZSkpfHxkYXkpOwogIGlmKG5pZ2h0JiZtLmFsaXZlJiZtLnJvbGU9PT0nbWFmaWEnKWgrPSc8ZGl2IGNsYXNzPWRpbT7QktGL0LHQtdGA0LjRgtC1INC20LXRgNGC0LLRgzwvZGl2Pic7CiAgaWYobmlnaHQmJm0uYWxpdmUmJm0ucm9sZT09PSdkb2N0b3InKWgrPSc8ZGl2IGNsYXNzPWRpbT7QmtC+0LPQviDQu9C10YfQuNGC0Yw/PC9kaXY+JzsKICBpZihuaWdodCYmbS5hbGl2ZSYmbS5yb2xlPT09J3NoZXJpZmYnKWgrPSc8ZGl2IGNsYXNzPWRpbT7QmtC+0LPQviDQv9GA0L7QstC10YDQuNGC0Yw/PC9kaXY+JzsKICBoKz0nPC9kaXY+PGRpdiBjbGFzcz1ncmlkPic7CiAgZm9yKGNvbnN0IHAgb2YgUy5wbGF5ZXJzKXsKICAgIGNvbnN0IHNlbD0obmlnaHQ/bS5waWNrOm0udm90ZWQpPT09cC5pZDsKICAgIGNvbnN0IHRhZz1wLnJvbGUmJnAucm9sZSE9PW0ucm9sZXx8cC5yb2xlJiZwaD09PSdlbmQnP2AgPHNwYW4gY2xhc3M9ZGltPiR7Uk9MRVtwLnJvbGVdfTwvc3Bhbj5gOicnOwogICAgaCs9YDxidXR0b24gY2xhc3M9InBsICR7c2VsPydzZWwnOicnfSAke3AuYWxpdmU/Jyc6J2RlYWQnfSIgJHtjYW5BY3QmJnAuYWxpdmU/Jyc6J2Rpc2FibGVkJ30gb25jbGljaz0iYWN0KCcke3AuaWR9JykiPiR7cC5vbmxpbmU/Jyc6J+KaqiAnfSR7ZXNjKHAubmFtZSl9JHt0YWd9PC9idXR0b24+YDsKICB9CiAgaCs9JzwvZGl2Pic7CiAgaWYoZGF5JiZtLmFsaXZlKWgrPWA8ZGl2IGNsYXNzPXJvdyBzdHlsZT0ibWFyZ2luLXRvcDo4cHgiPjxidXR0b24gb25jbGljaz0ic2VuZCh7dDondm90ZScsdGFyZ2V0Oidza2lwJ30pIj7Qn9GA0L7Qv9GD0YHRgtC40YLRjCDQs9C+0LvQvtGB0L7QstCw0L3QuNC1PC9idXR0b24+PC9kaXY+YDsKICByZXR1cm4gaDsKfQpjb25zdCBhY3Q9aWQ9PnNlbmQoe3Q6Uy5waGFzZT09PSduaWdodCc/J2FjdCc6J3ZvdGUnLHRhcmdldDppZH0pOwpmdW5jdGlvbiBpbnZpdGUoKXsKICBjb25zdCBsaW5rPShDRkcubGlua3x8bG9jYXRpb24ub3JpZ2luKSsoQ0ZHLmxpbms/Jz9zdGFydGFwcD0nOic/cm9vbT0nKStTLmNvZGU7CiAgY29uc3QgdD0n0JfQsNGF0L7QtNC4INCyIE1BRklBIE1IVSEg0JrQvtC0OiAnK1MuY29kZTsKICB0Zz90Zy5vcGVuVGVsZWdyYW1MaW5rKCdodHRwczovL3QubWUvc2hhcmUvdXJsP3VybD0nK2VuY29kZVVSSUNvbXBvbmVudChsaW5rKSsnJnRleHQ9JytlbmNvZGVVUklDb21wb25lbnQodCkpOm5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dChsaW5rKTsKfQpmdW5jdGlvbiBzaG9wSFRNTCgpewogIHJldHVybiBPYmplY3QuZW50cmllcyhDRkcuc2hvcCkubWFwKChbayxpXSk9PmA8ZGl2IGNsYXNzPWNhcmQ+PGIgY2xhc3M9cmVkPiR7aS50fTwvYj4gPHNwYW4gY2xhc3M9ZGltPsOXJHtNRT8uaW52W2tdfHwwfTwvc3Bhbj48ZGl2IGNsYXNzPWRpbT4ke2kuZH08L2Rpdj4KICA8ZGl2IGNsYXNzPXJvdyBzdHlsZT0ibWFyZ2luOjhweCAwIDAiPjxidXR0b24gb25jbGljaz0ic2VuZCh7dDonYnV5JyxpdGVtOicke2t9J30pIj7QmtGD0L/QuNGC0Ywg8J+qmSR7aS5wfTwvYnV0dG9uPjxidXR0b24gJHtNRT8uaW52W2tdPycnOidkaXNhYmxlZCd9IG9uY2xpY2s9InNlbmQoe3Q6J3VzZScsaXRlbTonJHtrfSd9KSI+0JjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGMPC9idXR0b24+PC9kaXY+PC9kaXY+YCkuam9pbignJykKICArJzxwIGNsYXNzPWRpbT7QlNC+0LrRg9C80LXQvdGC0Ysg4oCUINC80LDRhNC40Lgg0L3QvtGH0YzRji4g0JvQuNGG0L4g4oCUINC00L4g0L3QsNGH0LDQu9CwINC40LPRgNGLLjwvcD4nOwp9CmZ1bmN0aW9uIHRhc2tzSFRNTCgpe3JldHVybihNRT8udGFza3N8fFtdKS5tYXAodD0+YDxkaXYgY2xhc3M9Y2FyZD48Yj4ke3QudH08L2I+IDxzcGFuIGNsYXNzPWRpbT4ke3QucH0vJHt0Lm59PC9zcGFuPjxkaXYgY2xhc3M9cm93IHN0eWxlPSJtYXJnaW46OHB4IDAgMCI+PGJ1dHRvbiBjbGFzcz1wcmkgJHt0Lm9rPycnOidkaXNhYmxlZCd9IG9uY2xpY2s9InNlbmQoe3Q6J2NsYWltJyxpZDonJHt0LmlkfSd9KSI+0JfQsNCx0YDQsNGC0Ywg8J+qmSR7dC5yfTwvYnV0dG9uPjwvZGl2PjwvZGl2PmApLmpvaW4oJycpfQpmdW5jdGlvbiBjaGFucygpe2NvbnN0IGM9W1snYWxsJywn0J7QsdGJ0LjQuSddXTtpZihTPy5tZS5yb2xlPT09J21hZmlhJyYmWyduaWdodCcsJ2RheSddLmluY2x1ZGVzKFMucGhhc2UpKWMucHVzaChbJ21hZmlhJywn8J+puCDQqNGC0LDQsSddLFsnc2hhZG93Jywn8J+VtiDQqNC40YTRgNC+0LLQutCwJ10pO3JldHVybiBjfQpmdW5jdGlvbiByZW5kZXIoKXsKICAkKCdjb2lucycpLnRleHRDb250ZW50PSfwn6qZICcrKE1FPy5jb2lucz8/MCk7CiAgJCgnbWFpbicpLmlubmVySFRNTD10YWI9PT0nc2hvcCc/c2hvcEhUTUwoKTp0YWI9PT0ndGFza3MnP3Rhc2tzSFRNTCgpOihTP3Jvb21IVE1MKCk6bG9iYnlIVE1MKCkpOwogIGNvbnN0IG9uPSEhUyYmdGFiPT09J2dhbWUnOyQoJ2NoYXRib3gnKS5oaWRkZW49IW9uO2lmKCFvbilyZXR1cm47CiAgY29uc3QgY3M9Y2hhbnMoKTtpZighY3MuZmluZChjPT5jWzBdPT09Y2gpKWNoPSdhbGwnOwogICQoJ3RhYnMnKS5pbm5lckhUTUw9Y3MubWFwKGM9PmA8YnV0dG9uIGNsYXNzPSIke2NbMF09PT1jaD8nb24nOicnfSIgb25jbGljaz0iY2g9JyR7Y1swXX0nO3JlbmRlcigpIj4ke2NbMV19PC9idXR0b24+YCkuam9pbignJyk7CiAgY29uc3QgbGlzdD1TLmNoYXRbY2g9PT0nc2hhZG93Jz8nYWxsJzpjaF18fFtdOwogICQoJ21zZ3MnKS5pbm5lckhUTUw9KGNoPT09J3NoYWRvdyc/JzxkaXYgY2xhc3M9ZGltPtCh0L7QvtCx0YnQtdC90LjQtSDRg9C50LTRkdGCINCw0L3QvtC90LjQvNC90L4g0LIg0L7QsdGJ0LjQuSDRh9Cw0YIgKDHwn6qZLCDQtNC90ZHQvCk8L2Rpdj4nOicnKStsaXN0Lm1hcChtPT5tLnN5cz9gPGRpdiBjbGFzcz1zeXM+JHtlc2MobS54KX08L2Rpdj5gOmA8ZGl2PjxzcGFuIGNsYXNzPXdobz4ke2VzYyhtLm4pfTo8L3NwYW4+ICR7ZXNjKG0ueCl9PC9kaXY+YCkuam9pbignJyk7CiAgJCgnbXNncycpLnNjcm9sbFRvcD0xZTk7Cn0KZnVuY3Rpb24gc2VuZENoYXQoKXtjb25zdCB2PSQoJ2lucCcpLnZhbHVlLnRyaW0oKTtpZighdilyZXR1cm47c2VuZCh7dDonY2hhdCcsY2gsdGV4dDp2fSk7JCgnaW5wJykudmFsdWU9Jyd9CiQoJ3NuZCcpLm9uY2xpY2s9c2VuZENoYXQ7JCgnaW5wJykub25rZXlkb3duPWU9PmUua2V5PT09J0VudGVyJyYmc2VuZENoYXQoKTsKc2V0SW50ZXJ2YWwoKCk9Pntjb25zdCB0PSQoJ3RpbWVyJyk7aWYodCYmUz8uZW5kKXQudGV4dENvbnRlbnQ9TWF0aC5tYXgoMCxNYXRoLmNlaWwoKFMuZW5kLURhdGUubm93KCkpLzEwMDApKSsnINGBJ30sNTAwKTsKY29ubmVjdCgpO3JlbmRlcigpOwo8L3NjcmlwdD48L2JvZHk+PC9odG1sPgo=','base64').toString('utf8');
const MIN=4,MAX=15,NIGHT=45,DAY=90;
const SHOP={docs:{t:'Поддельные документы',d:'Шериф увидит вас мирным (1 раз)',p:30},face:{t:'Поддельное лицо',d:'В общем чате вы — «Незнакомец»',p:20}};
const TASKS=[{id:'play',t:'Сыграть партию',k:'games',n:1,r:10},{id:'win',t:'Победить',k:'wins',n:1,r:20},{id:'mw',t:'Победить за мафию',k:'mwins',n:1,r:30},{id:'chat',t:'Написать 10 сообщений',k:'msgs',n:10,r:5}];
const ROLE={mafia:'Мафия',city:'Мирный',doctor:'Доктор',sheriff:'Шериф'};

// ---- хранилище игроков (JSON) ----
let users={};try{users=JSON.parse(fs.readFileSync('users.json'))}catch{}
const save=()=>fs.writeFile('users.json',JSON.stringify(users),()=>{});
const U=id=>users[id]||(users[id]={coins:50,inv:{docs:0,face:0},st:{games:0,wins:0,mwins:0,msgs:0},cl:{}});

// ---- проверка Telegram initData ----
function verify(init){
  const p=new URLSearchParams(init),h=p.get('hash');p.delete('hash');
  const s=[...p].map(([k,v])=>k+'='+v).sort().join('\n');
  const key=crypto.createHmac('sha256','WebAppData').update(TOKEN).digest();
  if(!h||crypto.createHmac('sha256',key).update(s).digest('hex')!==h)return null;
  try{return JSON.parse(p.get('user'))}catch{return null}
}

const rooms={},where={}; // where[uid]=code
const send=(ws,o)=>ws&&ws.readyState===1&&ws.send(JSON.stringify(o));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const newCode=()=>{let c;do c=crypto.randomBytes(3).toString('hex').toUpperCase();while(rooms[c]);return c};

function meInfo(id){const u=U(id);return{coins:u.coins,inv:u.inv,tasks:TASKS.map(t=>{const c=u.cl[t.id]||0,p=u.st[t.k]-c*t.n;return{id:t.id,t:t.t,r:t.r,n:t.n,p:Math.min(p,t.n),ok:p>=t.n}})}}
function pushMe(p){send(p.ws,{t:'me',me:meInfo(p.id)})}

function view(r,p){
  const mf=p.role==='mafia',over=r.phase==='end';
  return{code:r.code,name:r.name,owner:r.owner,phase:r.phase,day:r.day,end:r.end,winner:r.winner,
    players:r.ps.map(q=>({id:q.id,name:q.name,alive:q.alive,online:!!q.ws,
      role:(over||(!q.alive&&r.phase!=='lobby')||q===p||(mf&&q.role==='mafia'))?q.role:null})),
    me:{id:p.id,role:p.role,alive:p.alive,pick:p.pick,voted:r.votes[p.id],notes:p.notes,armed:p.armed},
    chat:{all:r.chat.all.slice(-60),mafia:mf?r.chat.mafia.slice(-60):[]}};
}
function bcast(r){for(const p of r.ps){send(p.ws,{t:'state',s:view(r,p)})}}
function sys(r,text,ch='all'){r.chat[ch].push({n:'Система',x:text,sys:1})}

function setPhase(r,ph,secs){
  clearTimeout(r.timer);r.phase=ph;
  if(secs){r.end=Date.now()+secs*1000;r.timer=setTimeout(()=>advance(r),secs*1000)}else r.end=0;
  for(const p of r.ps)p.pick=null;
  r.votes={};r.night={kill:{},heal:null,check:null};
  bcast(r);
}
const alive=r=>r.ps.filter(p=>p.alive);

function startGame(r){
  const n=r.ps.length,m=n>=13?3:n>=10?2:1;
  const roles=Array(m).fill('mafia');roles.push('sheriff');if(n>=6)roles.push('doctor');
  while(roles.length<n)roles.push('city');
  roles.sort(()=>Math.random()-.5);
  r.ps.forEach((p,i)=>{p.role=roles[i];p.alive=true;p.notes=[];p.armed=false;p.alias=null});
  r.chat={all:[],mafia:[]};r.day=1;r.winner=null;
  sys(r,`Игра началась. В городе ${m} мафиози. Наступает ночь 1.`);
  sys(r,'Мафия, знакомьтесь: '+r.ps.filter(p=>p.role==='mafia').map(p=>p.name).join(', '),'mafia');
  setPhase(r,'night',NIGHT);
}
function advance(r){r.phase==='night'?resolveNight(r):r.phase==='day'&&resolveDay(r)}
function top(map){ // {voterId:targetId} -> список лидеров
  const c={};Object.values(map).forEach(t=>c[t]=(c[t]||0)+1);
  const mx=Math.max(0,...Object.values(c));return{mx,ids:Object.keys(c).filter(k=>c[k]===mx)};
}
function resolveNight(r){
  const{ids}=top(r.night.kill);let msg='Ночь прошла тихо: никто не погиб.';
  if(ids.length){
    const t=r.ps.find(p=>p.id===rnd(ids));
    if(t&&t.id!==r.night.heal){t.alive=false;msg=`Этой ночью убит ${t.name}. Он был: ${ROLE[t.role]}.`}
    else msg='Мафия стреляла, но Доктор спас жертву!';
  }
  sys(r,msg);if(endCheck(r))return;
  setPhase(r,'day',DAY);
}
function resolveDay(r){
  const v={};for(const[k,t]of Object.entries(r.votes))if(t!=='skip')v[k]=t;
  const{ids}=top(v);
  if(ids.length===1){const t=r.ps.find(p=>p.id===ids[0]);t.alive=false;sys(r,`Город казнил ${t.name}. Он был: ${ROLE[t.role]}.`)}
  else sys(r,'Голоса разделились — никто не казнён.');
  if(endCheck(r))return;
  r.day++;sys(r,`Наступает ночь ${r.day}.`);setPhase(r,'night',NIGHT);
}
function endCheck(r){
  const a=alive(r),m=a.filter(p=>p.role==='mafia').length,o=a.length-m;
  if(m>0&&m<o)return false;
  r.winner=m===0?'city':'mafia';
  sys(r,r.winner==='city'?'Победил город!':'Победила мафия!');
  for(const p of r.ps){
    const u=U(p.id),w=(p.role==='mafia')===(r.winner==='mafia');
    u.st.games++;u.coins+=10;if(w){u.st.wins++;u.coins+=25;if(p.role==='mafia')u.st.mwins++}
    p.armed=false;
  }
  save();clearTimeout(r.timer);r.phase='end';r.end=0;bcast(r);r.ps.forEach(pushMe);return true;
}
function earlyEnd(r){
  if(r.phase==='night'){
    const a=alive(r),ok=a.every(p=>p.role==='mafia'?r.night.kill[p.id]:p.role==='doctor'?r.night.heal:p.role==='sheriff'?p.pick:true);
    if(ok)resolveNight(r);
  }else if(r.phase==='day'&&alive(r).every(p=>r.votes[p.id]))resolveDay(r);
}

// ---- комнаты ----
function join(ws,u,code){
  const r=rooms[code];if(!r)return send(ws,{t:'err',m:'Комната не найдена'});
  let p=r.ps.find(q=>q.id===u.id);
  if(!p){
    if(r.phase!=='lobby'&&r.phase!=='end')return send(ws,{t:'err',m:'Игра уже идёт'});
    if(r.ps.length>=MAX)return send(ws,{t:'err',m:'Комната заполнена (15)'});
    p={id:u.id,name:u.name,alive:true,notes:[]};r.ps.push(p);sys(r,p.name+' вошёл в комнату');
  }
  p.ws=ws;ws.p=p;ws.r=r;where[u.id]=code;bcast(r);pushMe(p);
}
function leave(ws){
  const r=ws.r,p=ws.p;if(!r)return;
  delete where[p.id];ws.r=ws.p=null;
  if(r.phase==='lobby'||r.phase==='end'){
    r.ps=r.ps.filter(q=>q!==p);
    if(!r.ps.length){clearTimeout(r.timer);delete rooms[r.code];return}
    if(r.owner===p.id)r.owner=r.ps[0].id;
  }else{p.ws=null;if(p.alive){p.alive=false;sys(r,p.name+' покинул игру');if(endCheck(r))return;earlyEnd(r)}}
  send(ws,{t:'state',s:null});bcast(r);
}

function onMsg(ws,m){
  if(m.t==='auth'){
    const u=DEV?{id:'dev'+(m.dev||'1'),name:m.dev?'Dev'+m.dev:'Dev1'}:(()=>{const x=verify(m.init);return x&&{id:String(x.id),name:x.first_name+(x.last_name?' '+x.last_name:'')}})();
    if(!u)return send(ws,{t:'err',m:'Ошибка авторизации'});
    ws.u=u;send(ws,{t:'cfg',link:BOT_LINK,shop:SHOP});U(u.id);
    const code=where[u.id]||(m.join||'').toUpperCase();
    if(code)join(ws,u,code);else{send(ws,{t:'state',s:null});send(ws,{t:'me',me:meInfo(u.id)})}
    return;
  }
  const u=ws.u;if(!u)return;
  const r=ws.r,p=ws.p;
  switch(m.t){
    case'create':{
      if(r)return;const code=newCode();
      rooms[code]={code,name:String(m.name||'Без названия').slice(0,24),owner:u.id,ps:[],phase:'lobby',day:0,votes:{},night:{kill:{}},chat:{all:[],mafia:[]},made:Date.now()};
      return join(ws,u,code)}
    case'join':return r?0:join(ws,u,String(m.code||'').toUpperCase().trim());
    case'leave':return leave(ws);
    case'start':
      if(!r||r.owner!==u.id||(r.phase!=='lobby'&&r.phase!=='end'))return;
      if(r.ps.length<MIN)return send(ws,{t:'err',m:`Нужно минимум ${MIN} игрока`});
      return startGame(r);
    case'chat':{
      if(!r||!p)return;const x=String(m.text||'').trim().slice(0,300);if(!x)return;
      const inGame=r.phase==='night'||r.phase==='day';
      if(m.ch==='mafia'){if(p.role!=='mafia'||!inGame)return;r.chat.mafia.push({n:p.name,x})}
      else if(m.ch==='shadow'){ // шифровка: анонимное сообщение мафии в общий чат
        if(p.role!=='mafia'||!p.alive||r.phase!=='day')return send(ws,{t:'err',m:'Шифровка доступна живой мафии днём'});
        const us=U(p.id);if(us.coins<1)return send(ws,{t:'err',m:'Нужна 1 монета'});
        us.coins--;r.chat.all.push({n:'Аноним',x});pushMe(p)}
      else{
        if(inGame&&!(r.phase==='day'&&p.alive))return;
        r.chat.all.push({n:p.alias?'Незнакомец':p.name,x});}
      U(p.id).st.msgs++;bcast(r);return}
    case'act':{ // ночное действие
      if(!r||r.phase!=='night'||!p.alive)return;
      const t=r.ps.find(q=>q.id===m.target&&q.alive);if(!t)return;
      if(p.role==='mafia'){r.night.kill[p.id]=t.id}
      else if(p.role==='doctor'){r.night.heal=t.id}
      else if(p.role==='sheriff'){
        const isM=t.role==='mafia'&&!t.armed;if(t.role==='mafia'&&t.armed)t.armed=false;
        p.notes.push(`Ночь ${r.day}: ${t.name} — ${isM?'МАФИЯ':'мирный'}`)}
      else return;
      p.pick=t.id;bcast(r);return earlyEnd(r)}
    case'vote':{
      if(!r||r.phase!=='day'||!p.alive)return;
      if(m.target==='skip')r.votes[p.id]='skip';
      else{const t=r.ps.find(q=>q.id===m.target&&q.alive);if(!t)return;r.votes[p.id]=t.id}
      bcast(r);return earlyEnd(r)}
    case'buy':{
      const it=SHOP[m.item],us=U(u.id);if(!it)return;
      if(us.coins<it.p)return send(ws,{t:'err',m:'Не хватает монет'});
      us.coins-=it.p;us.inv[m.item]++;save();return send(ws,{t:'me',me:meInfo(u.id)})}
    case'use':{
      const us=U(u.id);if(!r||!p||!SHOP[m.item]||us.inv[m.item]<1)return send(ws,{t:'err',m:'Предмет можно использовать в комнате'});
      if(m.item==='docs'){if(p.role!=='mafia'||r.phase!=='night')return send(ws,{t:'err',m:'Документы: мафии, ночью'});p.armed=true}
      if(m.item==='face'){if(r.phase==='night'||r.phase==='day')return send(ws,{t:'err',m:'Надеть лицо можно до игры'});p.alias=1}
      us.inv[m.item]--;save();pushMe(p);return bcast(r)}
    case'claim':{
      const t=TASKS.find(x=>x.id===m.id),us=U(u.id);if(!t)return;
      const c=us.cl[t.id]||0;if(us.st[t.k]-c*t.n<t.n)return;
      us.cl[t.id]=c+1;us.coins+=t.r;save();return send(ws,{t:'me',me:meInfo(u.id)})}
  }
}

// ---- HTTP + WS ----
const srv=http.createServer((q,s)=>{
  if(q.url==='/health'){s.end('ok');return}
  s.setHeader('Content-Type','text/html; charset=utf-8');
  s.end(HTML);
});
const wss=new WebSocketServer({server:srv});
wss.on('connection',ws=>{
  ws.on('message',d=>{try{onMsg(ws,JSON.parse(d))}catch(e){console.error(e)}});
  ws.on('close',()=>{const r=ws.r,p=ws.p;if(r&&p&&p.ws===ws){p.ws=null;bcast(r)}}); // переподключение: состояние остаётся в комнате
});
setInterval(()=>{for(const c in rooms){const r=rooms[c];if(r.ps.every(p=>!p.ws)&&Date.now()-r.made>36e5*3){clearTimeout(r.timer);r.ps.forEach(p=>delete where[p.id]);delete rooms[c]}}},6e4);
srv.listen(PORT,()=>console.log('MHU MAFIA on :'+PORT));

// ---- авто-настройка бота: кнопка меню открывает игру ----
(async()=>{
  const url=process.env.PUBLIC_URL||process.env.RENDER_EXTERNAL_URL;
  if(!TOKEN)return console.log('Нет BOT_TOKEN');
  const api=(m,b)=>fetch('https://api.telegram.org/bot'+TOKEN+'/'+m,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b||{})}).then(r=>r.json());
  try{
    const me=await api('getMe');if(me.ok&&!BOT_LINK)BOT_LINK='https://t.me/'+me.result.username;
    if(url){const r=await api('setChatMenuButton',{menu_button:{type:'web_app',text:'MAFIA MHU',web_app:{url}}});console.log('menu button',r.ok)}
    else console.log('Нет PUBLIC_URL — кнопка меню не настроена');
  }catch(e){console.error(e)}
})();
