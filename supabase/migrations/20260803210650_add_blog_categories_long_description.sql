-- Adds an optional, longer-form description field to blog_categories for
-- the expanded copy shown under the article listing on each category page.
-- Does not touch the existing `description` column, which stays the single
-- source for the short visible text under the H1, meta description, Open
-- Graph/Twitter description and CollectionPage.description in structured
-- data - see components/blog/CategoryContent.tsx and
-- app/blog/[identifier]/page.tsx.
--
-- Safe to run independently of the app deploy in either order: the app's
-- categories query uses `select=*`, which never errors on a column that
-- does not exist yet - it simply omits the key from the response until this
-- migration has run.
--
-- Idempotent: safe to re-run if it was already applied.
alter table public.blog_categories
  add column if not exists long_description text;

-- Deliberately nullable, no default, no NOT NULL constraint - a category
-- without long_description simply renders without the expanded section
-- (see CategoryContent.tsx).

-- Populate the four public categories with their approved expanded copy.
-- Each update targets an exact slug and touches only that one row - no
-- other columns (name, slug, description, active, sort_order) are changed.

update public.blog_categories
set long_description = 'Tahle kategorie se věnuje pohybu, který lze zařadit i do běžného pracovního týdne, bez nutnosti hodinových tréninků nebo přesných plánů. Věnujeme se tomu, co ti nejvíc brání začít, i tomu, co ti pomáhá u pohybu zůstat déle než pár dní.

Popisujeme, jak si cvičení postupně nastavit jako přirozený návyk, který nezávisí na tom, jakou zrovna máš náladu nebo kolik volného času ti zbývá. Vysvětlujeme také, proč se do pohybu občas vůbec nechce, a co pomáhá v období, kdy se po nemoci, dovolené nebo náročnějších týdnech vracíš k pravidelnému pohybu jen pomalu.

Cílem není dokonalý tréninkový plán, ale realistický přístup k pohybu, který vydrží i v běžném pracovním životě. Najdeš tu konkrétní kroky k tomu, jak začít, jak u pohybu zůstat dlouhodobě a jak se k němu vrátit, i když cesta není přímočará.'
where slug = 'cviceni-a-pohyb';

update public.blog_categories
set long_description = 'V této kategorii se věnujeme jídlu v době, kdy nezbývá čas ani energie na dlouhé vaření. Ukazujeme, jak si jídlo poskládat jednoduše a bez zbytečného přemýšlení, i když je celý den zaplněný prací a dalšími povinnostmi.

Řešíme praktické situace, které běžný pracovní den přináší. Co si připravit na svačinu do práce, jak se najíst v náročném dni a proč večer někdy přichází chuť projít celou ledničku. Věnujeme se také chuti na sladké a tomu, jak s ní pracovat bez přísných zákazů a neustálých výčitek.

Nejde o snahu sestavit dokonalý jídelníček, který bude fungovat jen za ideálních podmínek. Cílem je najít jednoduchý a dlouhodobě použitelný přístup k jídlu, který se dá přizpůsobit běžnému životu a pomůže ti lépe zvládat i dny, kdy na přípravu jídla nezbývá mnoho času.'
where slug = 'jidelnicek-a-recepty';

update public.blog_categories
set long_description = 'Začít se změnou je jen jedna část. Mnohem složitější bývá pokračovat ve chvíli, kdy přijde únava, pochybnosti, výčitky nebo nepochopení ze strany okolí. Tato kategorie se proto nevěnuje samotnému cvičení nebo jídlu, ale tomu, co ovlivňuje, zda u svého rozhodnutí dokážeš zůstat.

Píšeme o tom, proč se změna někdy zastaví, přestože ti na ní záleží, a jak se k ní vrátit po období, kdy se ti nedařilo pokračovat. Věnujeme se výčitkám spojeným s jídlem nebo vynechaným cvičením i tomu, jak si říct o podporu doma, když rodina nebo partner tvému rozhodnutí úplně nerozumí.

Nenajdeš tu motivační hesla ani obecné rady, které fungují jen ve dnech plných energie. Jde o praktický pohled na to, jak se změnou pokračovat i v běžných dnech, kdy všechno nejde podle představ.'
where slug = 'motivace-a-podpora';

update public.blog_categories
set long_description = 'Únava, stres a každodenní návyky ovlivňují, kolik energie ti během dne zbývá, i když se právě soustředíš hlavně na jídlo nebo pohyb. Tato kategorie se věnuje širším souvislostem běžného života, které mají vliv na to, jak se cítíš a kolik prostoru dokážeš věnovat sama sobě.

Rozebíráme, proč se můžeš cítit často unavená, jak stres souvisí s přejídáním a jak tento koloběh postupně zmírnit. Píšeme také o nastavování hranic, když toho na sebe bereš příliš, a o přístupu všechno, nebo nic, který komplikuje vytváření dlouhodobě udržitelných změn. Součástí je i hledání pravidelného času pro sebe bez pocitu, že kvůli tomu zanedbáváš ostatní povinnosti.

Nejde o velké životní zvraty. Zaměřujeme se na drobné úpravy, které mohou pomoci lépe zvládat stres, šetřit energii a vytvořit si v běžném dni více prostoru pro vlastní potřeby.'
where slug = 'osobni-rozvoj';
