// ============================================================
// ScoutPro - Seed Data & Database Layer (localStorage-backed)
// ============================================================

const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('sp_' + key)) || []; } catch(e) { return []; } },
  set: (key, val) => localStorage.setItem('sp_' + key, JSON.stringify(val)),
  getObj: (key) => { try { return JSON.parse(localStorage.getItem('sp_' + key)) || {}; } catch(e) { return {}; } },
  setObj: (key, val) => localStorage.setItem('sp_' + key, JSON.stringify(val)),
};

// ─── SEED CLUBS (60+) ───────────────────────────────────────
const SEED_CLUBS = [
  // NORWAY
  { id:'c1', name:'KFUM Oslo', country:'Norway', league_level:'Eliteserien', playing_style:'High Press', age_profile:'U23 / Senior', foreign_player_openness:'Medium', contact_email:'scout@kfum.no', ideal_archetypes:'Box-to-Box Midfielder, Pressing Forward', notes:'Community-driven club, good pathway for young Scandinavians.' },
  { id:'c2', name:'HamKam', country:'Norway', league_level:'Eliteserien', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@hamkam.no', ideal_archetypes:'Deep-Lying Playmaker, Ball-Playing Defender', notes:'Strong tactical identity, good for technical players.' },
  { id:'c3', name:'Ranheim IL', country:'Norway', league_level:'1. divisjon', playing_style:'High Press', age_profile:'U21 / U23', foreign_player_openness:'High', contact_email:'scout@ranheim.no', ideal_archetypes:'Pressing Forward, Winger', notes:'Development-focused, excellent for young European talents.' },
  { id:'c4', name:'Brann', country:'Norway', league_level:'Eliteserien', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'football@brann.no', ideal_archetypes:'Target Striker, Holding Midfielder', notes:'Traditional Norwegian club with European ambitions.' },
  { id:'c5', name:'Viking FK', country:'Norway', league_level:'Eliteserien', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@viking-fk.no', ideal_archetypes:'Inverted Winger, Overlapping Full-Back', notes:'Active in foreign player recruitment.' },
  // SWEDEN
  { id:'c6', name:'GAIS', country:'Sweden', league_level:'Allsvenskan', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@gais.se', ideal_archetypes:'Advanced Playmaker, Box-to-Box Midfielder', notes:'Historic club, good for creative players.' },
  { id:'c7', name:'Östers IF', country:'Sweden', league_level:'Superettan', playing_style:'Direct Play', age_profile:'U21 / Senior', foreign_player_openness:'High', contact_email:'scout@osters.se', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Rebuilding project, open to foreign talent.' },
  { id:'c8', name:'Landskrona BoIS', country:'Sweden', league_level:'Division 1', playing_style:'High Press', age_profile:'U23', foreign_player_openness:'High', contact_email:'football@landskrona.se', ideal_archetypes:'Pressing Forward, Winger', notes:'Lower league, good for players needing game time.' },
  { id:'c9', name:'IFK Värnamo', country:'Sweden', league_level:'Allsvenskan', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scout@ifkv.se', ideal_archetypes:'Holding Midfielder, Centre-Back', notes:'Newly promoted, looking to stabilize.' },
  { id:'c10', name:'Degerfors IF', country:'Sweden', league_level:'Allsvenskan', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@degerfors.se', ideal_archetypes:'Inverted Winger, Advanced Playmaker', notes:'Compact defensive structure.' },
  // DENMARK
  { id:'c11', name:'HB Køge', country:'Denmark', league_level:'1. Division', playing_style:'High Press', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@hbkoge.dk', ideal_archetypes:'Box-to-Box Midfielder, Pressing Forward', notes:'Women\'s football powerhouse, growing men\'s program.' },
  { id:'c12', name:'Fremad Amager', country:'Denmark', league_level:'2. Division', playing_style:'Possession', age_profile:'U21', foreign_player_openness:'High', contact_email:'football@fremad.dk', ideal_archetypes:'Deep-Lying Playmaker, Ball-Playing Defender', notes:'Copenhagen-based, good urban scouting ground.' },
  { id:'c13', name:'Silkeborg IF', country:'Denmark', league_level:'Superliga', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scout@silkeborg.dk', ideal_archetypes:'Advanced Playmaker, Overlapping Full-Back', notes:'Established Superliga club.' },
  { id:'c14', name:'Viborg FF', country:'Denmark', league_level:'Superliga', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@viborg.dk', ideal_archetypes:'Target Striker, Holding Midfielder', notes:'Good European pathway.' },
  // PORTUGAL
  { id:'c15', name:'Casa Pia AC', country:'Portugal', league_level:'Primeira Liga', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@casapia.pt', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Promoted club with ambitious project, very open to foreign players.' },
  { id:'c16', name:'CD Mafra', country:'Portugal', league_level:'Liga Portugal 2', playing_style:'Counter-Attack', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@cdmafra.pt', ideal_archetypes:'Pressing Forward, Inverted Winger', notes:'Excellent stepping stone to top Portuguese clubs.' },
  { id:'c17', name:'Estrela da Amadora', country:'Portugal', league_level:'Primeira Liga', playing_style:'High Press', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@estrela.pt', ideal_archetypes:'Box-to-Box Midfielder, Aggressive Stopper', notes:'Lisbon-based, strong fan base.' },
  { id:'c18', name:'Oliveirense', country:'Portugal', league_level:'Liga Portugal 2', playing_style:'Direct Play', age_profile:'U21 / U23', foreign_player_openness:'High', contact_email:'scout@oliveirense.pt', ideal_archetypes:'Target Striker, Winger', notes:'Good development environment.' },
  { id:'c19', name:'Académica de Coimbra', country:'Portugal', league_level:'Liga Portugal 2', playing_style:'Possession', age_profile:'U23', foreign_player_openness:'High', contact_email:'scouting@academica.pt', ideal_archetypes:'Deep-Lying Playmaker, Centre-Back', notes:'University city club, intellectual football culture.' },
  { id:'c20', name:'FC Vizela', country:'Portugal', league_level:'Primeira Liga', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@fcvizela.pt', ideal_archetypes:'Advanced Playmaker, Overlapping Full-Back', notes:'Consistent Primeira Liga presence.' },
  // BELGIUM
  { id:'c21', name:'Lommel SK', country:'Belgium', league_level:'Challenger Pro League', playing_style:'High Press', age_profile:'U23', foreign_player_openness:'High', contact_email:'scouting@lommelunited.be', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Man City affiliate, excellent development pathway.' },
  { id:'c22', name:'RWDM Brussels', country:'Belgium', league_level:'First Amateur Division', playing_style:'Possession', age_profile:'U21 / U23', foreign_player_openness:'High', contact_email:'scout@rwdm.be', ideal_archetypes:'Advanced Playmaker, Inverted Winger', notes:'Brussels club with growing infrastructure.' },
  { id:'c23', name:'Beerschot VA', country:'Belgium', league_level:'First Division A', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@beerschot.be', ideal_archetypes:'Target Striker, Holding Midfielder', notes:'Antwerp-based, passionate support.' },
  { id:'c24', name:'OH Leuven', country:'Belgium', league_level:'First Division A', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@ohl.be', ideal_archetypes:'Ball-Playing Defender, Deep-Lying Playmaker', notes:'KRC Genk feeder, Man City network.' },
  { id:'c25', name:'Dender EH', country:'Belgium', league_level:'First Division A', playing_style:'Counter-Attack', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@dender.be', ideal_archetypes:'Pressing Forward, Aggressive Stopper', notes:'Newly promoted, building squad.' },
  // CZECH REPUBLIC
  { id:'c26', name:'Slovan Liberec', country:'Czech Republic', league_level:'Czech First League', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@fcslovanliberec.cz', ideal_archetypes:'Inverted Winger, Box-to-Box Midfielder', notes:'European competition regulars.' },
  { id:'c27', name:'FK Teplice', country:'Czech Republic', league_level:'Czech First League', playing_style:'Direct Play', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@fkteplice.cz', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Physical, direct football style.' },
  { id:'c28', name:'FC Zbrojovka Brno', country:'Czech Republic', league_level:'Czech First League', playing_style:'Possession', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@fczbrojovka.cz', ideal_archetypes:'Advanced Playmaker, Holding Midfielder', notes:'Second city club, strong youth system.' },
  { id:'c29', name:'SK Dynamo České Budějovice', country:'Czech Republic', league_level:'Czech First League', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'football@dynamo.cz', ideal_archetypes:'Ball-Playing Defender, Centre-Back', notes:'Solid mid-table club.' },
  // SLOVAKIA
  { id:'c30', name:'DAC Dunajská Streda', country:'Slovakia', league_level:'Fortuna Liga', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@dac1904.sk', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Hungarian community club, gateway to Central Europe.' },
  { id:'c31', name:'MŠK Žilina', country:'Slovakia', league_level:'Fortuna Liga', playing_style:'High Press', age_profile:'U21 / U23', foreign_player_openness:'High', contact_email:'scout@mskzilina.sk', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Excellent youth academy, multiple Champions League qualifiers.' },
  { id:'c32', name:'FK Senica', country:'Slovakia', league_level:'Fortuna Liga', playing_style:'Direct Play', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@fksenica.sk', ideal_archetypes:'Target Striker, Winger', notes:'Open to African talent recruitment.' },
  // AFRICA - ACADEMIES
  { id:'c33', name:'Right to Dream Academy', country:'Ghana', league_level:'Academy / Elite', playing_style:'Possession', age_profile:'U13–U19', foreign_player_openness:'High', contact_email:'recruitment@righttodream.com', ideal_archetypes:'Advanced Playmaker, Inverted Winger', notes:'World-class academy, partnership with FC Nordsjælland. Produces elite talent.' },
  { id:'c34', name:'Diambars FC', country:'Senegal', league_level:'Academy / Professional', playing_style:'High Press', age_profile:'U13–U21', foreign_player_openness:'High', contact_email:'scouting@diambars.org', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Dakar-based, co-founded by Patrick Vieira and Bernard Lama.' },
  { id:'c35', name:'Aspire Academy', country:'Qatar', league_level:'Academy / Elite', playing_style:'Possession', age_profile:'U12–U19', foreign_player_openness:'High', contact_email:'football@aspire.qa', ideal_archetypes:'All archetypes', notes:'State-of-the-art facilities, global talent scouting program.' },
  { id:'c36', name:'ASEC Mimosas Academy', country:'Ivory Coast', league_level:'Academy / Professional', playing_style:'Hybrid', age_profile:'U14–U21', foreign_player_openness:'High', contact_email:'scout@asecmimosas.ci', ideal_archetypes:'Winger, Pressing Forward', notes:'Produced Yaya Toure, Gervinho. Premier West African academy.' },
  { id:'c37', name:'Enyimba FC', country:'Nigeria', league_level:'NPFL', playing_style:'Direct Play', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@enyimbafc.com', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Two-time CAF Champions League winners.' },
  { id:'c38', name:'Mamelodi Sundowns', country:'South Africa', league_level:'DStv Premiership', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@sundowns.co.za', ideal_archetypes:'Advanced Playmaker, Deep-Lying Playmaker', notes:'Dominant South African club, CAF CL winners.' },
  { id:'c39', name:'TP Mazembe', country:'DR Congo', league_level:'Linafoot', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@mazembe.cd', ideal_archetypes:'Inverted Winger, Target Striker', notes:'Multiple CAF Champions League titles.' },
  { id:'c40', name:'Al Ahly SC', country:'Egypt', league_level:'Egyptian Premier League', playing_style:'High Press', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@alahly.com', ideal_archetypes:'Box-to-Box Midfielder, Pressing Forward', notes:'Most successful African club in history.' },
  // USA
  { id:'c41', name:'Tampa Bay Rowdies', country:'USA', league_level:'USL Championship', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@rowdies.com', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Historic USL club, strong community presence.' },
  { id:'c42', name:'Sacramento Republic FC', country:'USA', league_level:'USL Championship', playing_style:'High Press', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@sacrepublicfc.com', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Potential MLS expansion candidate.' },
  { id:'c43', name:'Louisville City FC', country:'USA', league_level:'USL Championship', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@loucityfc.com', ideal_archetypes:'Target Striker, Holding Midfielder', notes:'Strong USL brand, consistent playoff performer.' },
  { id:'c44', name:'Phoenix Rising FC', country:'USA', league_level:'USL Championship', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@phoenixrisingfc.com', ideal_archetypes:'Inverted Winger, Overlapping Full-Back', notes:'Western Conference powerhouse.' },
  { id:'c45', name:'FC Tulsa', country:'USA', league_level:'USL Championship', playing_style:'Direct Play', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@fctulsa.com', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Midwest market, growing fanbase.' },
  { id:'c46', name:'Atlanta United 2', country:'USA', league_level:'MLS Next Pro', playing_style:'Possession', age_profile:'U23', foreign_player_openness:'High', contact_email:'scouting@atlutd.com', ideal_archetypes:'Advanced Playmaker, Inverted Winger', notes:'MLS affiliate, excellent development pathway to MLS.' },
  { id:'c47', name:'New York City FC II', country:'USA', league_level:'MLS Next Pro', playing_style:'Possession', age_profile:'U23', foreign_player_openness:'High', contact_email:'scout@nycfc.com', ideal_archetypes:'Deep-Lying Playmaker, Ball-Playing Defender', notes:'Man City affiliate, best-in-class facilities.' },
  { id:'c48', name:'LA Galaxy II (Los Dos)', country:'USA', league_level:'MLS Next Pro', playing_style:'Counter-Attack', age_profile:'U23', foreign_player_openness:'High', contact_email:'scouting@lagalaxy.com', ideal_archetypes:'Pressing Forward, Winger', notes:'Historic MLS brand, West Coast base.' },
  { id:'c49', name:'University of Virginia', country:'USA', league_level:'NCAA Division I', playing_style:'Possession', age_profile:'U18–U22', foreign_player_openness:'High', contact_email:'soccer@virginia.edu', ideal_archetypes:'Advanced Playmaker, Box-to-Box Midfielder', notes:'Premier NCAA program, produced multiple MLS players.' },
  { id:'c50', name:'Indiana University', country:'USA', league_level:'NCAA Division I', playing_style:'High Press', age_profile:'U18–U22', foreign_player_openness:'High', contact_email:'soccer@indiana.edu', ideal_archetypes:'Pressing Forward, Holding Midfielder', notes:'Traditional powerhouse, Big Ten conference.' },
  { id:'c51', name:'Stanford University', country:'USA', league_level:'NCAA Division I', playing_style:'Possession', age_profile:'U18–U22', foreign_player_openness:'High', contact_email:'msoccer@stanford.edu', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Elite academics + football, Pac-12.' },
  // ADDITIONAL EUROPE
  { id:'c52', name:'Hammarby IF', country:'Sweden', league_level:'Allsvenskan', playing_style:'High Press', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scout@hammarby.se', ideal_archetypes:'Box-to-Box Midfielder, Pressing Forward', notes:'Stockholm club, strong brand.' },
  { id:'c53', name:'IFK Göteborg', country:'Sweden', league_level:'Allsvenskan', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'Medium', contact_email:'scouting@ifkgoteborg.se', ideal_archetypes:'Deep-Lying Playmaker, Overlapping Full-Back', notes:'Historic Swedish club, UEFA Cup winners.' },
  { id:'c54', name:'Aalborg BK', country:'Denmark', league_level:'Superliga', playing_style:'Counter-Attack', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@aabsport.dk', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Northern Denmark base.' },
  { id:'c55', name:'Randers FC', country:'Denmark', league_level:'Superliga', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@randersfc.dk', ideal_archetypes:'Inverted Winger, Centre-Back', notes:'Mid-table Superliga club.' },
  { id:'c56', name:'Paços de Ferreira', country:'Portugal', league_level:'Liga Portugal 2', playing_style:'Direct Play', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@fcpacos.pt', ideal_archetypes:'Target Striker, Winger', notes:'Consistent Liga Portugal presence.' },
  { id:'c57', name:'FC Famalicão', country:'Portugal', league_level:'Primeira Liga', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@fcfamalicao.pt', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Recently promoted, ambitious project.' },
  { id:'c58', name:'Waasland-Beveren', country:'Belgium', league_level:'Challenger Pro League', playing_style:'Direct Play', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@skbeveren.be', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Flemish club, good for physical players.' },
  { id:'c59', name:'Oud-Heverlee Leuven', country:'Belgium', league_level:'First Division A', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'football@ohl.be', ideal_archetypes:'Advanced Playmaker, Inverted Winger', notes:'University city, technical football.' },
  { id:'c60', name:'FC DAC 1904', country:'Slovakia', league_level:'Fortuna Liga', playing_style:'High Press', age_profile:'U21 / Senior', foreign_player_openness:'High', contact_email:'scouting@dac1904.sk', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Central European hub club.' },
  { id:'c61', name:'AS Vita Club', country:'DR Congo', league_level:'Linafoot', playing_style:'Hybrid', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scout@asvita.cd', ideal_archetypes:'Winger, Target Striker', notes:'Kinshasa-based, strong domestic record.' },
  { id:'c62', name:'Stade de Reims', country:'France', league_level:'Ligue 1', playing_style:'Possession', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@stade-de-reims.com', ideal_archetypes:'Advanced Playmaker, Ball-Playing Defender', notes:'Ligue 1 regular, good development environment.' },
  { id:'c63', name:'Troyes AC', country:'France', league_level:'Ligue 2', playing_style:'High Press', age_profile:'U23 / Senior', foreign_player_openness:'High', contact_email:'scout@estac.fr', ideal_archetypes:'Pressing Forward, Box-to-Box Midfielder', notes:'Man City affiliate, strong development pathway.' },
  { id:'c64', name:'FC Emmen', country:'Netherlands', league_level:'Eerste Divisie', playing_style:'Direct Play', age_profile:'Senior', foreign_player_openness:'High', contact_email:'scouting@fcemmen.nl', ideal_archetypes:'Target Striker, Aggressive Stopper', notes:'Dutch second tier, physical style.' },
];

// ─── SAMPLE PLAYERS ──────────────────────────────────────────
const SAMPLE_PLAYERS = [
  { id:'p1', name:'Kwame Asante', DOB:'2001-03-15', nationality:'Ghanaian', height:183, weight:78, dominant_foot:'Right', position:'Winger', archetype:'Inverted Winger', current_club:'Right to Dream', bio:'Explosive winger with elite dribbling ability and a powerful left foot. Graduated from Right to Dream Academy. Exceptional acceleration and 1v1 skills.', profile_image:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop&crop=face', highlight_video_url:'https://youtube.com/watch?v=example1', full_match_video_url:'https://youtube.com/watch?v=example2' },
  { id:'p2', name:'Luca Bianchi', DOB:'1999-07-22', nationality:'Italian', height:178, weight:72, dominant_foot:'Left', position:'Attacking Mid', archetype:'Advanced Playmaker', current_club:'FC Vizela', bio:'Creative attacking midfielder with exceptional vision and passing range. Technically gifted with strong set-piece delivery.', profile_image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face', highlight_video_url:'https://youtube.com/watch?v=example3', full_match_video_url:'https://youtube.com/watch?v=example4' },
  { id:'p3', name:'Oluwaseun Adeyemi', DOB:'2002-11-08', nationality:'Nigerian', height:190, weight:85, dominant_foot:'Right', position:'Centre-Back', archetype:'Ball-Playing Defender', current_club:'Enyimba FC', bio:'Commanding centre-back with excellent aerial ability and composure on the ball. Strong leader with good reading of the game.', profile_image:'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face', highlight_video_url:'https://youtube.com/watch?v=example5', full_match_video_url:'https://youtube.com/watch?v=example6' },
  { id:'p4', name:'Erik Lindström', DOB:'2000-05-30', nationality:'Swedish', height:181, weight:76, dominant_foot:'Right', position:'Central Mid', archetype:'Box-to-Box Midfielder', current_club:'GAIS', bio:'Energetic box-to-box midfielder with high work rate and excellent stamina. Strong in duels, good range of passing.', profile_image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', highlight_video_url:'https://youtube.com/watch?v=example7', full_match_video_url:'https://youtube.com/watch?v=example8' },
  { id:'p5', name:'Mamadou Diallo', DOB:'2003-01-19', nationality:'Senegalese', height:186, weight:82, dominant_foot:'Right', position:'Striker', archetype:'Target Striker', current_club:'Diambars FC', bio:'Powerful target striker with excellent hold-up play and aerial dominance. Developing rapidly with strong finishing ability.', profile_image:'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face', highlight_video_url:'https://youtube.com/watch?v=example9', full_match_video_url:'https://youtube.com/watch?v=example10' },
];

// ─── SAMPLE EVALUATIONS ──────────────────────────────────────
const SAMPLE_EVALS = [
  { id:'e1', player_id:'p1', evaluator_id:'admin', date:'2024-11-15', technical_score:82, tactical_score:74, physical_score:88, psychological_score:79, archetype_score:85, overall_score:82, risk_score:25, opportunity_score:88, recommended_league:'Eliteserien / Allsvenskan', recommended_clubs:'KFUM Oslo, Ranheim, Lommel SK', strengths:'Elite pace, 1v1 dribbling, left foot finishing, pressing intensity', weaknesses:'Defensive tracking, heading, consistency in big games', risk:'Young, needs adaptation to European football culture' },
  { id:'e2', player_id:'p2', evaluator_id:'admin', date:'2024-11-20', technical_score:88, tactical_score:86, physical_score:72, psychological_score:84, archetype_score:90, overall_score:84, risk_score:18, opportunity_score:92, recommended_league:'Primeira Liga / Belgian Pro League', recommended_clubs:'Casa Pia, OH Leuven, Lommel SK', strengths:'Vision, passing range, set pieces, leadership', weaknesses:'Physical duels, pace, aerial ability', risk:'Injury history with hamstring issues' },
  { id:'e3', player_id:'p3', evaluator_id:'admin', date:'2024-12-01', technical_score:78, tactical_score:82, physical_score:86, psychological_score:81, archetype_score:80, overall_score:81, risk_score:20, opportunity_score:85, recommended_league:'Czech First League / Slovak Fortuna Liga', recommended_clubs:'Slovan Liberec, DAC Dunajská Streda, MŠK Žilina', strengths:'Aerial dominance, leadership, ball-playing ability', weaknesses:'Pace, recovery speed', risk:'Limited European experience' },
  { id:'e4', player_id:'p4', evaluator_id:'admin', date:'2024-12-10', technical_score:75, tactical_score:80, physical_score:84, psychological_score:77, archetype_score:78, overall_score:79, risk_score:15, opportunity_score:78, recommended_league:'Allsvenskan / Danish Superliga', recommended_clubs:'Hammarby, Silkeborg, Aalborg BK', strengths:'Work rate, stamina, pressing, duels', weaknesses:'Creative play, final third decisions', risk:'Limited ceiling for top leagues' },
  { id:'e5', player_id:'p5', evaluator_id:'admin', date:'2024-12-15', technical_score:72, tactical_score:68, physical_score:90, psychological_score:75, archetype_score:76, overall_score:76, risk_score:30, opportunity_score:82, recommended_league:'Norwegian Eliteserien / Portuguese Liga 2', recommended_clubs:'Ranheim, CD Mafra, Oliveirense', strengths:'Physical power, aerial dominance, hold-up play', weaknesses:'Technical refinement, tactical awareness', risk:'Young, needs significant development time' },
];

// ─── KPI DEFINITIONS ─────────────────────────────────────────
const KPIS = {
  technical: [
    { name: 'First Touch', weight: 0.12, desc: 'Ball control under pressure' },
    { name: 'Passing Accuracy', weight: 0.15, desc: 'Short and long range passing' },
    { name: 'Dribbling', weight: 0.13, desc: '1v1 ability and ball retention' },
    { name: 'Shooting', weight: 0.12, desc: 'Finishing and shot technique' },
    { name: 'Crossing', weight: 0.10, desc: 'Delivery quality from wide areas' },
    { name: 'Heading', weight: 0.10, desc: 'Aerial challenge and direction' },
    { name: 'Set Pieces', weight: 0.08, desc: 'Dead ball delivery and routines' },
    { name: 'Weak Foot', weight: 0.10, desc: 'Non-dominant foot proficiency' },
    { name: 'Ball Retention', weight: 0.10, desc: 'Keeping possession under pressure' },
  ],
  tactical: [
    { name: 'Positioning', weight: 0.15, desc: 'Spatial awareness and positioning' },
    { name: 'Pressing', weight: 0.13, desc: 'Intensity and timing of press' },
    { name: 'Defensive Shape', weight: 0.12, desc: 'Defensive organization' },
    { name: 'Transition Play', weight: 0.13, desc: 'Attack-defense transitions' },
    { name: 'Decision Making', weight: 0.15, desc: 'Speed and quality of decisions' },
    { name: 'Movement', weight: 0.12, desc: 'Off-ball movement and runs' },
    { name: 'Tactical Flexibility', weight: 0.10, desc: 'Ability to play multiple roles' },
    { name: 'Game Reading', weight: 0.10, desc: 'Anticipation and game intelligence' },
  ],
  physical: [
    { name: 'Speed', weight: 0.18, desc: 'Sprint and top speed' },
    { name: 'Acceleration', weight: 0.15, desc: 'Explosive first step' },
    { name: 'Strength', weight: 0.13, desc: 'Physical power in duels' },
    { name: 'Stamina', weight: 0.15, desc: 'Endurance over 90 minutes' },
    { name: 'Agility', weight: 0.12, desc: 'Change of direction speed' },
    { name: 'Jumping', weight: 0.10, desc: 'Vertical leap and timing' },
    { name: 'Balance', weight: 0.08, desc: 'Body balance and coordination' },
    { name: 'Injury Resilience', weight: 0.09, desc: 'Physical durability' },
  ],
  psychological: [
    { name: 'Mentality', weight: 0.20, desc: 'Mental strength and resilience' },
    { name: 'Leadership', weight: 0.15, desc: 'Leadership on and off pitch' },
    { name: 'Communication', weight: 0.12, desc: 'Vocal and non-verbal communication' },
    { name: 'Coachability', weight: 0.15, desc: 'Receptiveness to coaching' },
    { name: 'Pressure Handling', weight: 0.15, desc: 'Performance under pressure' },
    { name: 'Motivation', weight: 0.13, desc: 'Drive and ambition' },
    { name: 'Team Player', weight: 0.10, desc: 'Sacrifice and team contribution' },
  ],
};

const ARCHETYPE_KPIS = {
  'Inverted Winger': [
    { name:'Cutting Inside', weight:0.20 }, { name:'Left Foot Shooting', weight:0.18 },
    { name:'Dribbling Speed', weight:0.17 }, { name:'Combination Play', weight:0.15 },
    { name:'Pressing Trigger', weight:0.15 }, { name:'xG Creation', weight:0.15 },
  ],
  'Advanced Playmaker': [
    { name:'Through Balls', weight:0.20 }, { name:'Vision', weight:0.20 },
    { name:'Set Piece Delivery', weight:0.15 }, { name:'Key Passes/90', weight:0.20 },
    { name:'Chance Creation', weight:0.15 }, { name:'Final Third Entries', weight:0.10 },
  ],
  'Ball-Playing Defender': [
    { name:'Progressive Passes', weight:0.20 }, { name:'Ball Under Pressure', weight:0.20 },
    { name:'Switch of Play', weight:0.15 }, { name:'Aerial Duels Won', weight:0.15 },
    { name:'Recovery Runs', weight:0.15 }, { name:'Line Breaking Passes', weight:0.15 },
  ],
  'Box-to-Box Midfielder': [
    { name:'Distance Covered', weight:0.20 }, { name:'Duels Won', weight:0.18 },
    { name:'Box Arrivals', weight:0.15 }, { name:'Ball Recovery', weight:0.17 },
    { name:'Pressing Intensity', weight:0.15 }, { name:'Key Passes', weight:0.15 },
  ],
  'Target Striker': [
    { name:'Hold-Up Play', weight:0.22 }, { name:'Aerial Duels', weight:0.20 },
    { name:'Link Play', weight:0.18 }, { name:'Movement in Box', weight:0.18 },
    { name:'Finishing', weight:0.22 },
  ],
  'Deep-Lying Playmaker': [
    { name:'Passing Range', weight:0.22 }, { name:'Ball Retention', weight:0.18 },
    { name:'Progressive Carries', weight:0.15 }, { name:'Interceptions', weight:0.15 },
    { name:'Positioning', weight:0.15 }, { name:'Switch of Play', weight:0.15 },
  ],
  'Pressing Forward': [
    { name:'Press Intensity', weight:0.25 }, { name:'Pressing Triggers', weight:0.20 },
    { name:'Ball Recovery in Attack', weight:0.18 }, { name:'Sprint Distance', weight:0.20 },
    { name:'Counter-Press', weight:0.17 },
  ],
  'Sweeper Keeper': [
    { name:'Sweeping', weight:0.22 }, { name:'Distribution', weight:0.20 },
    { name:'High Line Confidence', weight:0.18 }, { name:'Footwork', weight:0.20 },
    { name:'Command of Area', weight:0.20 },
  ],
  'Overlapping Full-Back': [
    { name:'Crossing Quality', weight:0.20 }, { name:'Defensive Duels', weight:0.18 },
    { name:'Overlap Runs', weight:0.20 }, { name:'Stamina', weight:0.17 },
    { name:'Combination Play', weight:0.15 }, { name:'Recovery Speed', weight:0.10 },
  ],
  'Aggressive Stopper': [
    { name:'Tackle Success Rate', weight:0.22 }, { name:'Aerial Duels', weight:0.20 },
    { name:'Interceptions', weight:0.18 }, { name:'Clearances', weight:0.15 },
    { name:'Positioning', weight:0.15 }, { name:'Aggression', weight:0.10 },
  ],
  'Holding Midfielder': [
    { name:'Ball Recovery', weight:0.22 }, { name:'Positional Discipline', weight:0.20 },
    { name:'Interceptions', weight:0.18 }, { name:'Passing Accuracy', weight:0.18 },
    { name:'Defensive Coverage', weight:0.12 }, { name:'Aerial Duels', weight:0.10 },
  ],
};

function getTier(score) {
  if (score >= 85) return { tier:'Elite', color:'#7c3aed', badge:'badge-elite' };
  if (score >= 75) return { tier:'High Prospect', color:'#2563eb', badge:'badge-prospect' };
  if (score >= 65) return { tier:'Development', color:'#d97706', badge:'badge-development' };
  return { tier:'Monitor', color:'#6b7280', badge:'badge-monitor' };
}

function getLeagueFit(score) {
  if (score >= 85) return 'Top 5 European Leagues';
  if (score >= 78) return 'Primeira Liga / Belgian Pro League / Allsvenskan';
  if (score >= 70) return 'Czech First League / Slovak Fortuna Liga / Norwegian Eliteserien';
  if (score >= 62) return 'Portuguese Liga 2 / USL Championship / Scandinavian Div 1';
  return 'Academy / Development League';
}

function initDB() {
  if (!localStorage.getItem('sp_initialized')) {
    DB.set('clubs', SEED_CLUBS);
    DB.set('players', SAMPLE_PLAYERS);
    DB.set('evaluations', SAMPLE_EVALS);
    DB.set('outreach', []);
    DB.set('users', [{ id:'u1', name:'Alex Morgan', email:'admin@scoutpro.com', role:'Admin' }]);
    localStorage.setItem('sp_initialized', '1');
  }
}

initDB();
