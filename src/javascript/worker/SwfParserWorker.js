/**
 * @type {object}
 */
const Util = {};

// shortcuts
Util.$tagObjects = [];
Util.$installed  = new Map();
Util.$swfParser  = null;
Util.$Rad2Deg    = 180 / Math.PI;

// JCT
Util.$JCT11280 = Function("var a=\"zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2\",C={\" \":0,\"!\":1},c=34,i=2,p,s=\"\",u=String.fromCharCode,t=u(12539);for(;++c<127;)C[u(c)]=c^39&&c^92?i++:0;i=0;for(;0<=(c=C[a.charAt(i++)]);)if(16===c)if((c=C[a.charAt(i++)])<87){if(86===c)c=1879;for(;c--;)s+=u(++p)}else s+=s.substr(8272,360);else if(c<86)s+=u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]);else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s+=u(p=c<40960?c:c|57344);else{c&=511;for(;c--;)s+=t;p=12539}return s")();

/**
 * @param  {string} value
 * @return {string}
 */
Util.$decodeToShiftJis = function (value)
{
    return value.replace(/%(8[1-9A-F]|[9E][0-9A-F]|F[0-9A-C])(%[4-689A-F][0-9A-F]|%7[0-9A-E]|[@-~])|%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])/ig,
        function (s)
        {
            let c = parseInt(s.substring(1, 3), 16);
            const l = s.length;
            return 3 === l
                ? String.fromCharCode(c < 160 ? c : c + 65216)
                : Util.$JCT11280.charAt((c < 160 ? c - 129 : c - 193) * 188 + (4 === l ? s.charCodeAt(3) - 64 : (c = parseInt(s.substring(4), 16)) < 127 ? c - 64 : c - 65));
        }
    );
};

/**
 * @return {array}
 * @static
 */
Util.$getTagObject = function ()
{
    return Util.$tagObjects.pop() ||
        {
            "placeObjects":  [],
            "sounds":        [],
            "removeObjects": [],
            "frameLabel":    []
        };
};

/**
 * @param  {object} tags
 * @return void
 * @static
 */
Util.$poolTagObject = function (tags)
{
    tags.placeObjects.length  = 0;
    tags.sounds.length        = 0;
    tags.removeObjects.length = 0;
    tags.frameLabel.length    = 0;
    Util.$tagObjects.push(tags);
};

/**
 * @return {object}
 * @static
 */
Util.$createMovieClip = function ()
{
    const movieClip = {};

    // init
    movieClip._$characterId  = 0;
    movieClip._$name         = "MovieClip";
    movieClip._$controller   = [];
    movieClip._$placeObjects = [];
    movieClip._$placeMap     = [];
    movieClip._$labels       = [];
    movieClip._$dictionary   = [];
    movieClip._$sounds       = [];

    return movieClip;
};

/**
 * @param   {object} object
 * @param   {number} frame
 * @param   {number} depth
 * @returns {number|null}
 * @static
 */
Util.$getControllerAt = function(object, frame, depth)
{
    if (depth in object._$controller[frame]) {
        return object._$controller[frame][depth];
    }
    return null;
};

/**
 * @param  {object} object
 * @param  {object} place_object
 * @return {number}
 * @static
 */
Util.$addDictionary = function (object, place_object)
{
    const id = object._$dictionary.length;

    // setup
    const obj = {
        "CharacterId": place_object.CharacterId,
        "Depth": place_object.Depth,
        "Name": null,
        "ClipDepth": 0,
        "PlaceFlagHasImage": place_object.PlaceFlagHasImage | 0,
        "StartFrame": place_object.StartFrame | 0,
        "EndFrame": place_object.EndFrame | 0
    };

    if (place_object.PlaceFlagHasName) {
        obj.Name = place_object.Name;
    }

    if (place_object.PlaceFlagHasClipDepth) {
        obj.ClipDepth = place_object.ClipDepth;
    }

    // set
    object._$dictionary[id] = obj;

    return id;
};

/**
 * @param  {string|number} blend_mode
 * @return {string}
 */
Util.$getBlendName = function (blend_mode)
{
    switch (blend_mode) {

        case 1:
        case "normal":
            return "normal";

        case 2:
        case "layer":
            return "layer";

        case 3:
        case "multiply":
            return "multiply";

        case 4:
        case "screen":
            return "screen";

        case 5:
        case "lighten":
            return "lighten";

        case 6:
        case "darken":
            return "darken";

        case 7:
        case "difference":
            return "difference";

        case 8:
        case "add":
            return "add";

        case 9:
        case "subtract":
            return "subtract";

        case 10:
        case "invert":
            return "invert";

        case 11:
        case "alpha":
            return "alpha";

        case 12:
        case "erase":
            return "erase";

        case 13:
        case "overlay":
            return "overlay";

        case 14:
        case "hardlight":
            return "hardlight";

        default:
            return "normal";

    }
};

/**
 * @class
 */
class ByteStream
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.clear();
    }

    /**
     * @return void
     * @public
     */
    clear ()
    {
        this.data        = null;
        this.bit_offset  = 0;
        this.byte_offset = 0;
        this.bit_buffer  = null;
    }

    /**
     * @param   {Uint8Array} data
     * @returns void
     */
    setData (data)
    {
        this.data = data;
    }

    /**
     * @param   {number} length
     * @returns {Uint8Array}
     */
    getData (length)
    {
        this.byteAlign();

        const offset = this.byte_offset + length;
        const array  = this.data.subarray(this.byte_offset, offset);

        this.byte_offset = offset;

        return array;
    }

    /**
     * @returns void
     */
    byteAlign ()
    {
        if (!this.bit_offset) {
            return;
        }

        this.byte_offset = this.byte_offset + (this.bit_offset + 7) / 8 | 0;
        this.bit_offset  = 0;
    }

    /**
     * @param   {uint} [is_jis=0]
     * @returns {string}
     */
    getDataUntil (is_jis = 0)
    {
        this.byteAlign();

        let str  = "";
        for (;;) {

            const code = this.data[this.byte_offset++];

            // end(code === 0)
            if (!code) {
                break;
            }

            if (code === 10 || code === 13) {
                str += "\n";
                continue;
            }

            let value = code.toString(16);
            if (value.length === 1) {
                value = "0" + value;
            }

            str += "%" + value;

        }

        if (!str.length) {
            return "";
        }

        if (str.length > 5 && str.substr(-5) === "\n") {
            str = str.slice(0, -5);
        }

        if (is_jis) {
            return Util.$decodeToShiftJis(str);
        }

        try
        {
            return decodeURIComponent(str);
        }
        catch (e)
        {
            return Util.$decodeToShiftJis(str);
        }

    }

    /**
     * @returns void
     */
    byteCarry ()
    {
        if (this.bit_offset > 7) {
            this.byte_offset  = this.byte_offset + (0 | (this.bit_offset + 7) / 8);
            this.bit_offset  &= 0x07;
        } else {
            while (this.bit_offset < 0) {
                --this.byte_offset;
                this.bit_offset += 8;
            }
        }
    }

    /**
     * @param   {number} number
     * @returns {number}
     */
    getUIBits (number)
    {
        let value = 0;
        while (number) {

            value <<= 1;
            value |= this.getUIBit();

            --number;
        }
        return value;
    }

    /**
     * @returns {number}
     */
    getUIBit ()
    {
        this.byteCarry();
        return this.data[this.byte_offset] >> 7 - this.bit_offset++ & 0x1;
    }

    /**
     * @param   {number} number
     * @returns {number}
     */
    getSIBits (number)
    {
        const value = this.getUIBits(number);
        const msb   = value & 0x1 << number - 1;
        if (msb) {
            return -(value ^ 2 * msb - 1) - 1;
        }
        return value;
    }

    /**
     * @returns {number}
     */
    getUI8 ()
    {
        this.byteAlign();
        return this.data[this.byte_offset++];
    }

    /**
     * @returns {number}
     */
    getUI16 ()
    {
        this.byteAlign();
        return this.getUI8() | this.getUI8() << 8;
    }

    /**
     * @returns {number}
     */
    getUI32 ()
    {
        this.byteAlign();
        return this.getUI8() | (this.getUI8()
            | (this.getUI8() | this.getUI8() << 8) << 8) << 8;
    }

    /**
     * @returns {number}
     */
    getFloat16 ()
    {
        const value0 = this.data[this.byte_offset++];
        const value1 = this.data[this.byte_offset++];

        let float = 0;
        float |= value1 << 8;
        float |= value0 << 0;

        return float;
    }

    /**
     * @returns {number}
     */
    getFloat32 ()
    {
        const value0 = this.data[this.byte_offset++];
        const value1 = this.data[this.byte_offset++];
        const value2 = this.data[this.byte_offset++];
        const value3 = this.data[this.byte_offset++];

        let rv = 0;
        rv |= value3 << 24;
        rv |= value2 << 16;
        rv |= value1 << 8;
        rv |= value0 << 0;

        const sign     = rv & 0x80000000;
        const exp      = rv >> 23 & 0xff;
        const fraction = rv & 0x7fffff;
        if (!rv || rv === 0x80000000) {
            return 0;
        }

        return (sign ? -1 : 1) *
            (fraction | 0x800000) *
            Math.pow(2, exp - 127 - 23);
    }

    /**
     * @param   {number} byte_int
     * @param   {number} bit_int
     * @returns void
     */
    incrementOffset (byte_int, bit_int)
    {
        this.byte_offset += byte_int;
        this.bit_offset  += bit_int;
        this.byteCarry();
    }

    /**
     * @param   {number} byte_int
     * @param   {number} bit_int
     * @returns void
     */
    setOffset (byte_int, bit_int)
    {
        this.byte_offset = byte_int;
        this.bit_offset  = bit_int;
    }
}

/**
 * @class
 */
class SwfParser
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.byteStream      = new ByteStream();
        this.currentPosition = { "x": 0, "y": 0 };
        this.jpegTables      = null;
        this.characters      = [];
        this.frameInfo       = [];
        this.fonts           = new Map();
        this.textSettings    = new Map();
        this.grids           = new Map();
        this.version         = 0;
    }

    /**
     * @return void
     * @public
     */
    clear ()
    {
        // param reset
        this.byteStream.clear();
        this.currentPosition.x = 0;
        this.currentPosition.y = 0;
        this.jpegTables        = null;
        this.characters.length = 0;
        this.frameInfo.length  = 0;
        this.version           = 0;
    }

    /**
     * @param   {number} character_id
     * @returns {object}
     * @public
     */
    getCharacter (character_id)
    {
        return this.characters[character_id];
    }

    /**
     * @param   {number} character_id
     * @param   {object} character
     * @param   {array}  [options=undefined]
     * @returns void
     * @public
     */
    setCharacter (character_id, character, options)
    {
        this.characters[character_id] = character;

        globalThis.postMessage({
            "infoKey": "character",
            "characterId": character_id,
            "piece": character
        }, options);
    }

    /**
     * @param   {number} character_id
     * @returns {object}
     * @public
     */
    getFont (character_id)
    {
        return this.fonts.get(character_id);
    }

    /**
     * @param   {number} character_id
     * @param   {object} font
     * @returns void
     * @public
     */
    setFont (character_id, font)
    {
        this.fonts.set(character_id, font);
    }

    /**
     * @param  {number} character_id
     * @param  {object} text_setting
     * @return void
     * @public
     */
    setTextSetting (character_id, text_setting)
    {
        this.textSettings.set(character_id, text_setting);
    }

    /**
     * @param  {number} character_id
     * @param  {object} grid
     * @return void
     * @public
     */
    setGrid (character_id, grid)
    {
        this.grids.set(character_id, grid);
    }

    /**
     * @param   {object} parent
     * @param   {object} tags
     * @param   {number} frame
     * @param   {array}  cache_place_objects
     * @returns void
     * @public
     */
    showFrame (parent, tags, frame, cache_place_objects)
    {
        let length, keys;

        const prevFrame = frame - 1 | 0;

        // Frame Label
        const labels = tags.frameLabel;

        length = labels.length;
        for (let idx = 0; idx < length; ++idx) {

            const label = labels[idx];

            // if frameInfo match case
            if (label.name in this.frameInfo) {
                label.frame = this.frameInfo["@" + label.name];
            }

            parent._$labels.push({
                "label": label.name,
                "frame": label.frame || frame
            });
        }

        const sounds = tags.sounds;

        length = sounds.length | 0;
        if (length) {
            parent._$sounds.push({
                "frame": frame,
                "data": sounds.slice(0)
            });
        }

        // remove objects
        const removeObjects = tags.removeObjects;

        length = removeObjects.length;
        for (let idx = 0; idx < length; ++idx) {

            const removeObject = removeObjects[idx];

            const id = Util.$getControllerAt(parent, prevFrame, removeObject.Depth);
            parent._$dictionary[id].EndFrame = frame;

            Util.$installed.set(removeObject.Depth, 1);

        }

        // new cache
        if (!(frame in cache_place_objects)) {
            cache_place_objects[frame] = [];
        }

        // init
        if (!(frame in parent._$controller)) {
            parent._$controller[frame] = [];
        }

        if (!(frame in parent._$placeMap)) {
            parent._$placeMap[frame] = [];
        }

        // place objects
        const placeObjects     = tags.placeObjects;
        const prevPlaceObjects = prevFrame ? cache_place_objects[prevFrame] : null;

        length = placeObjects.length;
        for (let idx = 0; idx < length; ++idx) {

            // id reset
            let instanceId = null;

            const placeObject = placeObjects[idx];

            // reset
            let prevPlaceObject = null;
            if (prevFrame && placeObject.Depth in prevPlaceObjects) {
                prevPlaceObject = prevPlaceObjects[placeObject.Depth];
            }

            // set prev characterId
            if (placeObject.PlaceFlagHasCharacter === 0 && prevPlaceObject) {

                placeObject.CharacterId = prevPlaceObject.CharacterId;

            }

            let isNewCharacter = false;
            if (placeObject.PlaceFlagMove === 0
                || placeObject.PlaceFlagMove === 1 && placeObject.PlaceFlagHasCharacter === 1
            ) {
                isNewCharacter = true;
            }

            // character clone
            if (prevFrame && !isNewCharacter) {

                instanceId = Util.$getControllerAt(parent, prevFrame, placeObject.Depth);
                if (instanceId === null) {
                    isNewCharacter = true;
                }

            }

            // prev data set
            if (placeObject.PlaceFlagMove === 1 && prevPlaceObject) {

                if (prevPlaceObject.PlaceFlagHasMatrix === 1
                    && !placeObject.PlaceFlagHasMatrix // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasMatrix = 1;
                    placeObject.Matrix = prevPlaceObject.Matrix;
                }

                if (prevPlaceObject.PlaceFlagHasColorTransform === 1
                    && !placeObject.PlaceFlagHasColorTransform // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasColorTransform = 1;
                    placeObject.ColorTransform = prevPlaceObject.ColorTransform;
                }

                if (prevPlaceObject.PlaceFlagHasClipDepth === 1
                    && !placeObject.PlaceFlagHasClipDepth // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasClipDepth = 1;
                    placeObject.ClipDepth = prevPlaceObject.ClipDepth;
                }

                if (prevPlaceObject.PlaceFlagHasRatio === 1
                    && !placeObject.PlaceFlagHasRatio // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasRatio = 1;
                    placeObject.Ratio = prevPlaceObject.Ratio;
                }

                if (prevPlaceObject.PlaceFlagHasFilterList === 1
                    && !placeObject.PlaceFlagHasFilterList // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasFilterList = 1;
                    placeObject.SurfaceFilterList = prevPlaceObject.SurfaceFilterList;
                }

                if (prevPlaceObject.PlaceFlagHasBlendMode === 1
                    && !placeObject.PlaceFlagHasBlendMode // 0 or undefined
                ) {
                    placeObject.PlaceFlagHasBlendMode = 1;
                    placeObject.BlendMode = prevPlaceObject.BlendMode;
                }

            }

            // prev remove
            if (prevFrame && !Util.$installed.has(placeObject.Depth)) {

                const removeId = Util.$getControllerAt(parent, prevFrame, placeObject.Depth);

                if (removeId !== null) {

                    const removeTag = parent._$dictionary[removeId];

                    if (removeTag && (placeObject.PlaceFlagMove === 0 || placeObject.PlaceFlagHasCharacter === 1)) {

                        removeTag.EndFrame = frame | 0;
                        parent._$dictionary[removeId] = removeTag;

                        isNewCharacter = true;

                    }
                }

            }

            // character new build
            if (isNewCharacter) {

                placeObject.StartFrame = frame | 0;
                placeObject.EndFrame   = 0;

                if (placeObject.PlaceFlagHasCharacter === 1 && placeObject.PlaceFlagMove === 1) {

                    const cId  = Util.$getControllerAt(parent, prevFrame, placeObject.Depth);
                    const dTag = parent._$dictionary[cId];

                    dTag.EndFrame = frame | 0;
                    parent._$dictionary[cId] = dTag;

                }

                instanceId = Util.$addDictionary(parent, placeObject);

            }

            // start set instance
            parent._$controller[frame][placeObject.Depth] = instanceId;

            const id = parent._$placeObjects.length;

            parent._$placeObjects[id] = this.buildPlaceObject(placeObject);
            parent._$placeMap[frame][placeObject.Depth] = id;

            // flag
            Util.$installed.set(placeObject.Depth, 1);

            // cache
            cache_place_objects[frame][placeObject.Depth] = placeObject;

        }

        // clone prev frame
        if (prevFrame) {

            let depth;

            const controller = parent._$controller[prevFrame];

            keys   = Object.keys(controller);
            length = keys.length;
            for (let idx = 0; idx < length; ++idx) {

                depth = keys[idx] | 0;
                if (Util.$installed.has(depth)) {
                    continue;
                }

                // clone
                cache_place_objects[frame][depth] = cache_place_objects[prevFrame][depth];
                parent._$controller[frame][depth] = controller[depth];

            }

            const places = parent._$placeMap[prevFrame];

            keys   = Object.keys(places);
            length = keys.length;
            for (let idx = 0; idx < length; ++idx) {

                depth = keys[idx];
                if (depth in parent._$placeMap[frame]) {
                    continue;
                }

                parent._$placeMap[frame][depth] = places[depth];

            }

        }

        Util.$installed.clear();
    }

    /**
     * @param   {object} tag
     * @returns {object}
     */
    buildPlaceObject (tag)
    {
        const placeObject = {
            "matrix": [1,0,0,1,0,0],
            "colorTransform": [1,1,1,1,0,0,0,0],
            "filters": null,
            "blendMode": "normal"
        };

        // Matrix
        if (tag.PlaceFlagHasMatrix) {
            placeObject.matrix = tag.Matrix;
        }

        // ColorTransform
        if (tag.PlaceFlagHasColorTransform) {
            placeObject.colorTransform = tag.ColorTransform;
        }

        // Filter
        if (tag.PlaceFlagHasFilterList) {
            placeObject.surfaceFilterList = tag.SurfaceFilterList;
        }

        // BlendMode
        if (tag.PlaceFlagHasBlendMode) {
            placeObject.blendMode = Util.$getBlendName(tag.BlendMode);
        }

        // morph ratio
        if (tag.PlaceFlagHasRatio) {
            placeObject.ratio = tag.Ratio || 0;
        }

        return placeObject;
    }

    /**
     * @param {object} parent
     * @returns void
     * @public
     */
    postData (parent)
    {

        // merge textSetting
        if (this.textSettings.size) {
            for (let [id, value] of this.textSettings) {

                const character = this.characters[id];
                if (character) {
                    character._$textSetting = value;

                    globalThis.postMessage({
                        "infoKey": "character",
                        "characterId": id,
                        "piece": character
                    });

                }

            }
            this.textSettings.clear();
        }

        // merge grid
        if (this.grids.size) {
            for (let [id, value] of this.grids) {

                const character = this.characters[id];
                if (character) {
                    character._$grid = value;

                    globalThis.postMessage({
                        "infoKey": "character",
                        "characterId": id,
                        "piece": character
                    });

                }

            }
            this.grids.clear();
        }

        // post font
        if (this.fonts.size) {

            for (let [id, value] of this.fonts) {

                if (!value._$hasLayout) {

                    globalThis.postMessage({
                        "infoKey": "font",
                        "index": id,
                        "piece": value
                    });

                    continue;
                }

                // clone
                const glyphShapeTable   = value._$glyphShapeTable;
                const zoneTable         = value._$zoneTable;

                // delete
                value._$glyphShapeTable = [];
                value._$zoneTable       = zoneTable ? [] : null;

                // start
                globalThis.postMessage({
                    "infoKey": "font",
                    "index": id,
                    "piece": value
                }, [value._$advanceTable.buffer, value._$codeTable.buffer]);

                const length = glyphShapeTable.length;
                if (length) {

                    const tables  = [];
                    const options = [];

                    for (let idx = 0; idx < length; ++idx) {

                        const shapeTable = glyphShapeTable[idx];

                        tables.push(shapeTable);
                        options.push(shapeTable.records.buffer);

                        if (tables.length > 256) {

                            globalThis.postMessage({
                                "infoKey": "font_shape",
                                "index": id,
                                "pieces": tables
                            }, options);

                            options.length = 0;
                            tables.length  = 0;
                        }
                    }

                    // post
                    if (tables.length) {
                        globalThis.postMessage({
                            "infoKey": "font_shape",
                            "index": id,
                            "pieces": tables
                        }, options);
                    }

                }

                if (zoneTable) {

                    while (zoneTable.length) {

                        const length = Math.min(256, zoneTable.length);

                        globalThis.postMessage({
                            "infoKey": "font_zone",
                            "index": id,
                            "pieces": zoneTable.splice(0, length)
                        });

                    }

                }

            }

            this.fonts.clear();
        }

        // adjustment
        for (let idx = 1; idx < parent._$controller.length; ++idx) {
            const controller = parent._$controller[idx];
            parent._$controller[idx] = controller.filter(() => true);
        }

        this.setCharacter(0, parent);
    }

    /**
     * @param   {number} data_length
     * @param   {object} parent
     * @returns void
     * @public
     */
    parseTags (data_length, parent)
    {

        // init tags
        const tags = Util.$getTagObject();

        let frame = 1;
        const cachePlaceObjects = [];
        const byteStream = this.byteStream;
        while (byteStream.byte_offset < data_length) {

            const tagStartOffset = byteStream.byte_offset;
            if (tagStartOffset + 2 > data_length) {
                break;
            }

            const tagLength = byteStream.getUI16();
            const tagType   = tagLength >> 6;

            // long
            let length = tagLength & 0x3f;
            if (length === 0x3f) {
                if (tagStartOffset + 6 > data_length) {
                    byteStream.byte_offset = tagStartOffset;
                    byteStream.bit_offset  = 0;
                    break;
                }
                length = byteStream.getUI32();
            }

            const tagDataStartOffset = byteStream.byte_offset;
            this.parseTag(tagType, length, parent, frame, tags, cachePlaceObjects);

            if (tagType === 1) {

                // next frame
                ++frame;

                // reset
                tags.placeObjects.length  = 0;
                tags.sounds.length        = 0;
                tags.removeObjects.length = 0;
                tags.frameLabel.length    = 0;

            }

            const offset = byteStream.byte_offset - tagDataStartOffset | 0;
            if (offset !== length) {
                if (offset < length) {
                    byteStream.byte_offset = byteStream.byte_offset + (length - offset);
                }
            }

            byteStream.bit_offset = 0;
        }

        // object pool
        Util.$poolTagObject(tags);
    }

    /**
     * @param  {number} tag_type
     * @param  {number} length
     * @param  {object} parent
     * @param  {number} frame
     * @param  {object} tags
     * @param  {array}  cache_place_objects
     * @return void
     * @public
     */
    parseTag (tag_type, length, parent, frame, tags, cache_place_objects)
    {
        switch (tag_type) {

            case 28: // RemoveObject2
                tags.removeObjects.push({
                    "Frame": frame,
                    "Depth": this.byteStream.getUI16()
                });
                break;

            case 4:  // PlaceObject
            case 26: // PlaceObject2
            case 70: // PlaceObject3
                tags.placeObjects.push(
                    this.parsePlaceObject(tag_type, length)
                );
                break;

            case 39: // DefineSprite
                {
                    const dataLength  = this.byteStream.byte_offset + length;
                    const characterId = this.byteStream.getUI16();
                    this.byteStream.getUI16(); // FrameCount

                    // new MovieClip
                    const mc = Util.$createMovieClip();
                    mc._$characterId = characterId;

                    // parse
                    this.parseTags(dataLength, mc);

                    // adjustment
                    for (let idx = 1; idx < mc._$controller.length; ++idx) {
                        const controller = mc._$controller[idx];
                        mc._$controller[idx] = controller.filter(() => true);
                    }

                    // post
                    this.setCharacter(characterId, mc);
                }
                break;

            case 1: // ShowFrame
                this.showFrame(parent, tags, frame, cache_place_objects);
                break;

            case 2:  // DefineShape
            case 22: // DefineShape2
            case 32: // DefineShape3
            case 83: // DefineShape4
                if (length < 10) {
                    this.byteStream.byte_offset += length;
                } else {
                    this.parseDefineShape(tag_type);
                }
                break;

            case 20: // DefineBitsLossless
            case 36: // DefineBitsLossless2
                this.parseDefineBitsLossLess(tag_type, length);
                break;

            case 6:  // DefineBits
            case 21: // DefineBitsJPEG2
            case 35: // DefineBitsJPEG3
            case 90: // DefineBitsJPEG4
                this.parseDefineBits(tag_type, length, this.jpegTables);
                break;

            case 15: // StartSound
            case 89: // StartSound2
                tags.sounds.push(this.parseStartSound(tag_type));
                break;

            case 10: // DefineFont
            case 48: // DefineFont2
            case 75: // DefineFont3
                this.parseDefineFont(tag_type, length);
                break;

            case 14: // DefineSound
                this.parseDefineSound(length);
                break;

            case 13: // DefineFontInfo
            case 62: // DefineFontInfo2
                this.parseDefineFontInfo(tag_type, length);
                break;

            case 43: // FrameLabel
                tags.frameLabel.push(this.parseFrameLabel());
                break;

            case 11: // DefineText
            case 33: // DefineText2
                this.parseDefineText(tag_type);
                break;

            case 37: // DefineEditText
                this.parseDefineEditText(tag_type);
                break;

            case 7:  // DefineButton
            case 34: // DefineButton2
                this.parseDefineButton(tag_type, length);
                break;

            case 88: // DefineFontName
                this.parseDefineFontName();
                break;

            case 8:  // JPEGTables
                if (length) {
                    this.jpegTables = this.parseJPEGTables(length);
                }
                break;

            case 46: // DefineMorphShape
            case 84: // DefineMorphShape2
                this.parseDefineMorphShape(tag_type);
                break;

            case 18: // SoundStreamHead
            case 45: // SoundStreamHead2
                this.parseSoundStreamHead(tag_type);
                break;

            case 17: // DefineButtonSound
                this.parseDefineButtonSound();
                break;

            case 73: // DefineFontAlignZones
                this.parseDefineFontAlignZones();
                break;

            case 74: // CSMTextSettings
                this.parseCSMTextSettings(tag_type);
                break;

            case 19: // SoundStreamBlock
                this.parseSoundStreamBlock(tag_type, length);
                break;

            case 78: // DefineScalingGrid
                this.parseDefineScalingGrid();
                break;

            case 5:  // RemoveObject
                console.log("TODO RemoveObject type 5.");
                tags.removeObjects.push({
                    "CharacterId": this.byteStream.getUI16(),
                    "Depth":       this.byteStream.getUI16()
                });
                break;

            case 0: // End
                break;

            // Skip tags
            case 86: // DefineSceneAndFrameLabelData
            case 76: // SymbolClass
            case 56: // ExportAssets
            case 9:  // BackgroundColor
            case 40: // NameCharacter
            case 24: // Protect
            case 63: // DebugID
            case 64: // EnableDebugger2
            case 69: // FileAttributes
            case 65: // ScriptLimits
            case 77: // MetaData
            case 60: // DefineVideoStream
            case 61: // VideoFrame
            case 41: // ProductInfo
            case 87: // DefineBinaryData
            case 59: // DoInitAction
            case 12: // DoAction
            case 72: // DoABC
            case 82: // DoABC2
                this.byteStream.byte_offset += length;
                break;

            // TODO Tags
            case 3:  // FreeCharacter
            case 16: // StopSound
            case 23: // DefineButtonCxform
            case 25: // PathsArePostScript
            case 29: // SyncFrame
            case 31: // FreeAll
            case 38: // DefineVideo
            case 42: // DefineTextFormat
            case 44: // DefineBehavior
            case 47: // FrameTag
            case 49: // GeProSet
            case 52: // FontRef
            case 53: // DefineFunction
            case 54: // PlaceFunction
            case 55: // GenTagObject
            case 57: // ImportAssets
            case 58: // EnableDebugger
            case 66: // SetTabIndex
            case 71: // ImportAssets2
            case 91: // DefineFont4
            case 93: // EnableTelemetry
                console.log("[TODO] tagType -> " + tag_type);
                break;

            case 27: // 27 (invalid)
            case 30: // 30 (invalid)
            case 67: // 67 (invalid)
            case 68: // 68 (invalid)
            case 79: // 79 (invalid)
            case 80: // 80 (invalid)
            case 81: // 81 (invalid)
            case 85: // 85 (invalid)
            case 92: // 92 (invalid)
                break;

            default: // null
                break;

        }
    }

    /**
     * @param   {number} tag_type
     * @returns void
     * @public
     */
    parseDefineShape (tag_type)
    {
        const characterId = this.byteStream.getUI16() | 0;
        const bounds      = this.rect();

        if (tag_type === 83) {

            const obj = {};

            this.rect();

            // Reserved
            this.byteStream.getUIBits(5);

            obj.UsesFillWindingRule   = this.byteStream.getUIBits(1);
            obj.UsesNonScalingStrokes = this.byteStream.getUIBits(1);
            obj.UsesScalingStrokes    = this.byteStream.getUIBits(1);

        }

        const records = this.shapeWithStyle(tag_type);
        this.setCharacter(characterId, {
            "_$records":     records,
            "_$name":        "Shape",
            "_$bounds":      bounds,
            "_$characterId": characterId
        }, [records.ShapeData.records.buffer]);

    }

    /**
     * @returns {{xMin: number, xMax: number, yMin: number, yMax: number}}
     * @public
     */
    rect ()
    {
        // init
        this.byteStream.byteAlign();

        const nBits = this.byteStream.getUIBits(5);
        return {
            "xMin": this.byteStream.getSIBits(nBits) / 20,
            "xMax": this.byteStream.getSIBits(nBits) / 20,
            "yMin": this.byteStream.getSIBits(nBits) / 20,
            "yMax": this.byteStream.getSIBits(nBits) / 20
        };
    }

    /**
     * @param   {number} tag_type
     * @returns {object}
     * @public
     */
    shapeWithStyle (tag_type)
    {
        // setup
        const obj = {};

        switch (tag_type) {

            case 46:
            case 84:
                break;

            default:
                obj.fillStyles = this.fillStyleArray(tag_type);
                obj.lineStyles = this.lineStyleArray(tag_type);
                break;

        }

        const numBits      = this.byteStream.getUI8();
        const NumFillBits  = numBits >> 4;
        const NumLineBits  = numBits & 0x0f;
        obj.ShapeData = this.shapeRecords(tag_type, {
            "FillBits": NumFillBits,
            "LineBits": NumLineBits
        });

        return obj;
    }

    /**
     * @param   {number} tag_type
     * @returns {array}
     * @public
     */
    fillStyleArray (tag_type)
    {
        let fillStyleCount = this.byteStream.getUI8() | 0;
        if (tag_type > 2 && fillStyleCount === 0xff) {
            fillStyleCount = this.byteStream.getUI16();
        }

        const fillStyles = [];
        for (let idx = 0; idx < fillStyleCount; ++idx) {
            fillStyles[fillStyles.length] = this.fillStyle(tag_type);
        }

        return fillStyles;
    }

    /**
     * @param   {number} tag_type
     * @returns {object}
     * @public
     */
    fillStyle (tag_type)
    {
        const bitType = this.byteStream.getUI8();

        const obj = {};
        obj.fillStyleType = bitType;

        switch (bitType) {

            case 0x00:
                switch (tag_type) {

                    case 32:
                    case 83:
                        obj.Color = this.rgba();
                        break;

                    case 46:
                    case 84:
                        obj.StartColor = this.rgba();
                        obj.EndColor   = this.rgba();
                        break;

                    default:
                        obj.Color = this.rgb();
                        break;

                }
                break;

            case 0x10:
            case 0x12:
                switch (tag_type) {
                    case 46:
                    case 84:
                        obj.startGradientMatrix = this.matrix();
                        obj.endGradientMatrix   = this.matrix();
                        obj.gradient            = this.gradient(tag_type);
                        break;
                    default:
                        obj.gradientMatrix = this.matrix();
                        obj.gradient       = this.gradient(tag_type);
                        break;
                }
                break;

            case 0x13:
                obj.gradientMatrix = this.matrix();
                obj.gradient       = this.focalGradient(tag_type);
                break;

            case 0x40:
            case 0x41:
            case 0x42:
            case 0x43:
                obj.bitmapId = this.byteStream.getUI16();
                switch (tag_type) {
                    case 46:
                    case 84:
                        obj.startBitmapMatrix = this.matrix();
                        obj.endBitmapMatrix   = this.matrix();
                        break;
                    default:
                        obj.bitmapMatrix = this.matrix();
                        break;
                }
                break;

        }

        return obj;
    }

    /**
     * @return {{R: number, G: number, B: number, A: number}}
     * @public
     */
    rgb ()
    {
        return {
            "R": this.byteStream.getUI8() | 0,
            "G": this.byteStream.getUI8() | 0,
            "B": this.byteStream.getUI8() | 0,
            "A": 1
        };
    }

    /**
     * @return {{R: number|*, G: number|*, B: number|*, A: number}}
     * @public
     */
    rgba ()
    {
        return {
            "R": this.byteStream.getUI8(),
            "G": this.byteStream.getUI8(),
            "B": this.byteStream.getUI8(),
            "A": this.byteStream.getUI8() / 255
        };
    }

    /**
     * @returns {array}
     * @public
     */
    matrix ()
    {
        // init
        this.byteStream.byteAlign();

        const matrix = [1,0,0,1,0,0];
        if (this.byteStream.getUIBit()) {

            const nScaleBits = this.byteStream.getUIBits(5);

            matrix[0] = this.byteStream.getSIBits(nScaleBits) / 0x10000;
            matrix[3] = this.byteStream.getSIBits(nScaleBits) / 0x10000;
        }

        if (this.byteStream.getUIBit()) {

            const nRotateBits = this.byteStream.getUIBits(5);

            matrix[1] = this.byteStream.getSIBits(nRotateBits) / 0x10000;
            matrix[2] = this.byteStream.getSIBits(nRotateBits) / 0x10000;
        }

        const nTranslateBits = this.byteStream.getUIBits(5);

        matrix[4] = this.byteStream.getSIBits(nTranslateBits) / 20;
        matrix[5] = this.byteStream.getSIBits(nTranslateBits) / 20;

        return matrix;
    }

    /**
     * @param   {number} tag_type
     * @returns {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array}}
     * @public
     */
    gradient (tag_type)
    {
        let NumGradients;

        let SpreadMode        = 0;
        let InterpolationMode = 0;

        // init
        this.byteStream.byteAlign();

        switch (tag_type) {
            case 46:
            case 84:
                NumGradients = this.byteStream.getUI8();
                break;
            default:
                SpreadMode        = this.byteStream.getUIBits(2);
                InterpolationMode = this.byteStream.getUIBits(2);
                NumGradients      = this.byteStream.getUIBits(4);
                break;
        }

        const GradientRecords = [];
        for (let idx = 0; idx < NumGradients; ++idx) {
            GradientRecords[GradientRecords.length] = this.gradientRecord(tag_type);
        }

        return {
            "SpreadMode":        SpreadMode,
            "InterpolationMode": InterpolationMode,
            "GradientRecords":   GradientRecords,
            "FocalPoint":        0
        };
    }

    /**
     * @param  {number} tag_type
     * @return {object}
     * @public
     */
    gradientRecord (tag_type)
    {
        switch (tag_type) {

            case 46:
            case 84:
                return {
                    "StartRatio": this.byteStream.getUI8() / 255,
                    "StartColor": this.rgba(),
                    "EndRatio":   this.byteStream.getUI8() / 255,
                    "EndColor":   this.rgba()
                };

            default:
            {
                const Ratio = this.byteStream.getUI8();
                const Color = tag_type < 32 ? this.rgb() : this.rgba();

                return {
                    "Ratio": Ratio / 255,
                    "Color": Color
                };
            }

        }
    }

    /**
     * @param  {number} tag_type
     * @return {{SpreadMode: number, InterpolationMode: number, GradientRecords: Array, FocalPoint: number}}
     * @public
     */
    focalGradient (tag_type)
    {
        // init
        this.byteStream.byteAlign();

        const SpreadMode        = this.byteStream.getUIBits(2);
        const InterpolationMode = this.byteStream.getUIBits(2);
        const numGradients      = this.byteStream.getUIBits(4);

        const GradientRecords = [];
        for (let idx = 0; idx < numGradients; ++idx) {
            GradientRecords[GradientRecords.length] = this.gradientRecord(tag_type);
        }

        const FocalPoint = this.byteStream.getFloat16();

        return {
            "SpreadMode":        SpreadMode,
            "InterpolationMode": InterpolationMode,
            "GradientRecords":   GradientRecords,
            "FocalPoint":        FocalPoint
        };
    }

    /**
     * @param  {number} tag_type
     * @return {array}
     * @public
     */
    lineStyleArray (tag_type)
    {
        let lineStyleCount = this.byteStream.getUI8();
        if (tag_type > 2 && lineStyleCount === 0xff) {
            lineStyleCount = this.byteStream.getUI16();
        }

        const lineStyles = [];
        for (let idx = 0; idx < lineStyleCount; ++idx) {
            lineStyles[lineStyles.length] = this.lineStyles(tag_type);
        }

        return lineStyles;
    }

    /**
     * @param  {number} tag_type
     * @return {object}
     * @public
     */
    lineStyles (tag_type)
    {
        const obj = {};
        obj.fillStyleType = 0;

        switch (tag_type) {

            case 46:
                obj.StartWidth = this.byteStream.getUI16() / 20;
                obj.EndWidth   = this.byteStream.getUI16() / 20;
                obj.StartColor = this.rgba();
                obj.EndColor   = this.rgba();
                break;

            case 84:

                obj.StartWidth       = this.byteStream.getUI16() / 20;
                obj.EndWidth         = this.byteStream.getUI16() / 20;
                obj.StartCapStyle    = this.byteStream.getUIBits(2);
                obj.JoinStyle        = this.byteStream.getUIBits(2);
                obj.HasFillFlag      = this.byteStream.getUIBit();
                obj.NoHScaleFlag     = this.byteStream.getUIBit();
                obj.NoVScaleFlag     = this.byteStream.getUIBit();
                obj.PixelHintingFlag = this.byteStream.getUIBit();

                this.byteStream.getUIBits(5); // Reserved

                obj.NoClose     = this.byteStream.getUIBit();
                obj.EndCapStyle = this.byteStream.getUIBits(2);

                if (obj.JoinStyle === 2) {
                    obj.MiterLimitFactor = this.byteStream.getUI16() / 20;
                }

                if (obj.HasFillFlag) {
                    obj.FillType = this.fillStyle(tag_type);
                } else {
                    obj.StartColor = this.rgba();
                    obj.EndColor   = this.rgba();
                }

                break;

            case 83: // DefineShape4
                obj.Width            = this.byteStream.getUI16() / 20;
                obj.StartCapStyle    = this.byteStream.getUIBits(2);
                obj.JoinStyle        = this.byteStream.getUIBits(2);
                obj.HasFillFlag      = this.byteStream.getUIBit();
                obj.NoHScaleFlag     = this.byteStream.getUIBit();
                obj.NoVScaleFlag     = this.byteStream.getUIBit();
                obj.PixelHintingFlag = this.byteStream.getUIBit();

                this.byteStream.getUIBits(5); // Reserved

                obj.NoClose          = this.byteStream.getUIBit();
                obj.EndCapStyle      = this.byteStream.getUIBits(2);

                if (obj.JoinStyle === 2) {
                    obj.MiterLimitFactor = this.byteStream.getUI16();
                }

                if (obj.HasFillFlag) {
                    obj.FillType = this.fillStyle(tag_type);
                } else {
                    obj.Color = this.rgba();
                }

                break;

            case 32: // DefineShape3
                obj.Width         = this.byteStream.getUI16() / 20;
                obj.Color         = this.rgba();
                obj.JoinStyle     = 0;
                obj.StartCapStyle = 0;
                obj.EndCapStyle   = 0;
                break;

            default:  // DefineShape1or2
                obj.Width         = this.byteStream.getUI16() / 20;
                obj.Color         = this.rgb();
                obj.JoinStyle     = 0;
                obj.StartCapStyle = 0;
                obj.EndCapStyle   = 0;
                break;

        }

        return obj;
    }

    /**
     * @param  {number} tag_type
     * @param  {object} current_num_bits
     * @return {object}
     * @public
     */
    shapeRecords (tag_type, current_num_bits)
    {
        // reset
        this.currentPosition.x = 0;
        this.currentPosition.y = 0;

        const records = [];
        const styles  = [];

        for (;;) {

            const first6Bits = this.byteStream.getUIBits(6);
            if (first6Bits & 0x20) {

                const numBits = first6Bits & 0x0f;

                if (first6Bits & 0x10) {

                    // line
                    this.straightEdgeRecord(tag_type, numBits, records);

                    continue;
                }

                // curve
                this.curvedEdgeRecord(tag_type, numBits, records);

                continue;

            }

            if (first6Bits) {

                this.styleChangeRecord(
                    tag_type, first6Bits, current_num_bits, records, styles
                );

                continue;
            }

            // done
            records.push(-1);

            this.byteStream.byteAlign();
            break;
        }

        // create object
        const obj = {
            "records": new Int32Array(records)
        };

        // set styles
        if (styles.length) {
            obj.styles = styles;
        }

        return obj;
    }

    /**
     * @param  {number} tag_type
     * @param  {number} num_bits
     * @param  {array}  records
     * @return {void}
     * @public
     */
    straightEdgeRecord (tag_type, num_bits, records)
    {
        let deltaX = 0;
        let deltaY = 0;

        if (this.byteStream.getUIBit()) { // GeneralLineFlag

            deltaX = this.byteStream.getSIBits(num_bits + 2);
            deltaY = this.byteStream.getSIBits(num_bits + 2);

        } else {

            if (this.byteStream.getUIBit()) { // VertLineFlag
                deltaY = this.byteStream.getSIBits(num_bits + 2);
            } else {
                deltaX = this.byteStream.getSIBits(num_bits + 2);
            }

        }

        let AnchorX = deltaX;
        let AnchorY = deltaY;

        switch (tag_type) {

            case 46:
            case 84:
                break;

            default:

                AnchorX = this.currentPosition.x + deltaX;
                AnchorY = this.currentPosition.y + deltaY;

                // position
                this.currentPosition.x = AnchorX;
                this.currentPosition.y = AnchorY;

                break;
        }

        records.push(0, 0, AnchorX, AnchorY);
    }

    /**
     * @param  {number} tag_type
     * @param  {number} num_bits
     * @param  {array}  records
     * @return {void}
     * @public
     */
    curvedEdgeRecord (tag_type, num_bits, records)
    {

        const controlDeltaX = this.byteStream.getSIBits(num_bits + 2);
        const controlDeltaY = this.byteStream.getSIBits(num_bits + 2);
        const anchorDeltaX  = this.byteStream.getSIBits(num_bits + 2);
        const anchorDeltaY  = this.byteStream.getSIBits(num_bits + 2);

        let ControlX = controlDeltaX;
        let ControlY = controlDeltaY;
        let AnchorX  = anchorDeltaX;
        let AnchorY  = anchorDeltaY;

        switch (tag_type) {

            case 46:
            case 84:
                break;

            default:

                ControlX = this.currentPosition.x + controlDeltaX;
                ControlY = this.currentPosition.y + controlDeltaY;
                AnchorX  = ControlX + anchorDeltaX;
                AnchorY  = ControlY + anchorDeltaY;

                // position
                this.currentPosition.x = AnchorX;
                this.currentPosition.y = AnchorY;

                break;
        }

        records.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
    }

    /**
     * @param  {number} tag_type
     * @param  {number} change_flag
     * @param  {object} current_num_bits
     * @param  {array}  records
     * @param  {array}  styles
     * @return {void}
     * @public
     */
    styleChangeRecord (tag_type, change_flag, current_num_bits, records, styles)
    {

        // state
        const StateNewStyles  = change_flag >> 4 & 1;
        const StateLineStyle  = change_flag >> 3 & 1;
        const StateFillStyle1 = change_flag >> 2 & 1;
        const StateFillStyle0 = change_flag >> 1 & 1;
        const StateMoveTo     = change_flag & 1;

        let MoveX = 0;
        let MoveY = 0;
        if (StateMoveTo) {
            const moveBits = this.byteStream.getUIBits(5);

            MoveX = this.byteStream.getSIBits(moveBits);
            MoveY = this.byteStream.getSIBits(moveBits);

            // position
            this.currentPosition.x = MoveX;
            this.currentPosition.y = MoveY;
        }

        const FillStyle0 = StateFillStyle0
            ? this.byteStream.getUIBits(current_num_bits.FillBits)
            : 0;

        const FillStyle1 = StateFillStyle1
            ? this.byteStream.getUIBits(current_num_bits.FillBits)
            : 0;

        const LineStyle = StateLineStyle
            ? this.byteStream.getUIBits(current_num_bits.LineBits)
            : 0;

        let FillStyles  = null;
        let LineStyles  = null;
        let NumFillBits = 0;
        let NumLineBits = 0;
        if (StateNewStyles) {

            FillStyles = this.fillStyleArray(tag_type);
            LineStyles = this.lineStyleArray(tag_type);

            const numBits = this.byteStream.getUI8();
            current_num_bits.FillBits = NumFillBits = numBits >> 4;
            current_num_bits.LineBits = NumLineBits = numBits & 0x0f;
        }

        records.push(1, StateNewStyles);
        if (StateNewStyles) {
            records.push(NumFillBits, NumLineBits);
            styles.push({
                "FillStyles": FillStyles,
                "LineStyles": LineStyles
            });
        }

        records.push(StateMoveTo);
        if (StateMoveTo) {
            records.push(MoveX, MoveY);
        }

        records.push(StateFillStyle0);
        if (StateFillStyle0) {
            records.push(FillStyle0);
        }

        records.push(StateFillStyle1);
        if (StateFillStyle1) {
            records.push(FillStyle1);
        }

        records.push(StateLineStyle);
        if (StateLineStyle) {
            records.push(LineStyle);
        }

    }

    /**
     * @param {number} tag_type
     * @param {number} length
     * @public
     */
    parseDefineBitsLossLess (tag_type, length)
    {

        const startOffset    = this.byteStream.byte_offset;
        const CharacterId    = this.byteStream.getUI16();
        const format         = this.byteStream.getUI8();
        const width          = this.byteStream.getUI16();
        const height         = this.byteStream.getUI16();
        const isAlpha        = tag_type === 36;
        const colorTableSize = format === 3 ? this.byteStream.getUI8() + 1 : 0;

        let fileSize = width * height * 4;
        if (format === 3) {
            const colorSize = isAlpha ? 4 : 3;
            const padding   = (width + 3 & -4) - width | 0;
            fileSize        = (width + padding) * height + colorTableSize * colorSize;
        }

        // unCompress
        const position = length - (this.byteStream.byte_offset - startOffset);
        const offset   = this.byteStream.byte_offset;
        this.byteStream.byte_offset += position;

        const imageData = this
            .byteStream
            .data.slice(offset, this.byteStream.byte_offset);

        const character = {
            "width": width,
            "height": height,
            "format": format,
            "fileSize": fileSize,
            "tableSize": colorTableSize,
            "isAlpha": isAlpha,
            "color": isAlpha ? 0xff000000 : 0x000000,
            "_$name": "lossless",
            "_$characterId": CharacterId,
            "buffer": imageData
        };

        this.setCharacter(CharacterId, character, [imageData.buffer]);
    }

    /**
     * @param   {number} length
     * @returns {object}
     * @public
     */
    parseJPEGTables (length)
    {
        const offset = this.byteStream.byte_offset;
        this.byteStream.byte_offset += length;
        return {
            "offset": offset,
            "length": this.byteStream.byte_offset
        };
    }

    /**
     * @param   {number}     tag_type
     * @param   {number}     length
     * @param   {Uint8Array} [jpeg_tables=null]
     * @returns void
     * @public
     */
    parseDefineBits (tag_type, length, jpeg_tables = null)
    {

        const startOffset = this.byteStream.byte_offset;
        const CharacterId = this.byteStream.getUI16();

        const offset = this.byteStream.byte_offset - startOffset;

        const ImageDataSize = tag_type === 35 || tag_type === 90
            ? this.byteStream.getUI32()
            : length - offset;

        if (tag_type === 90) {
            const DeblockParam = this.byteStream.getUI16();
            console.log("TODO DeblockParam", DeblockParam);
        }

        const jpegOffset = this.byteStream.byte_offset;
        this.byteStream.byte_offset += ImageDataSize;

        let jpegData = this.byteStream.data.slice(
            jpegOffset, this.byteStream.byte_offset
        );

        if (jpeg_tables) {

            const jpegTables = this.byteStream.data.subarray(
                jpeg_tables.offset, jpeg_tables.length
            );

            if (jpegTables.length > 4
                && jpegData[0] === 0xff
                && jpegData[1] === 0xd8
            ) {

                const tLen = jpegTables.length - 2;
                const dLen = jpegData.length;

                const margeData = new Uint8Array(tLen + dLen);

                margeData.set(jpegTables.subarray(0, tLen), 0);
                margeData.set(jpegData.subarray(2, dLen), tLen);

                jpegData = margeData;

            }

        }

        // post message object
        const imageObject = {
            "infoKey": "character",
            "_$name": "imageData",
            "_$characterId": CharacterId,
            "jpegData": jpegData,
            "alphaData": null
        };

        const options = [];
        options.push(jpegData.buffer);

        let isAlpha = false;
        const alphaDataSize = startOffset + length - this.byteStream.byte_offset;
        if (alphaDataSize) {

            isAlpha = true;

            const alphaOffset = this.byteStream.byte_offset;
            this.byteStream.byte_offset += alphaDataSize;

            const alphaData = this.byteStream.data.slice(alphaOffset, this.byteStream.byte_offset);
            imageObject.alphaData = alphaData;
            options.push(alphaData.buffer);

        }

        imageObject.isAlpha = isAlpha;
        imageObject.color   = isAlpha ? 0xff000000 : 0x000000;

        this.setCharacter(CharacterId, imageObject, options);

        // post image data
        // globalThis.postMessage(imageObject, options);
    }

    /**
     * @param   {number} tag_type
     * @param   {number} length
     * @returns void
     * @public
     */
    parseDefineFont (tag_type, length)
    {

        const endOffset = this.byteStream.byte_offset + length | 0;

        // init font
        const FontId = this.byteStream.getUI16();

        const font = this.getFont(FontId) || {};

        let numGlyphs   = 0;
        let wideOffsets = 0;
        let wideCodes   = 0;
        if (tag_type === 48 || tag_type === 75) {

            const fontFlags  = this.byteStream.getUI8();
            font._$hasLayout = fontFlags >>> 7 & 1;
            font._$shiftJIS  = fontFlags >>> 6 & 1;
            font._$smallText = fontFlags >>> 5 & 1;
            font._$ANSI      = fontFlags >>> 4 & 1;
            wideOffsets      = fontFlags >>> 3 & 1;
            wideCodes        = fontFlags >>> 2 & 1;
            font._$italic    = fontFlags >>> 1 & 1;
            font._$bold      = fontFlags & 1;

            this.byteStream.byteAlign();

            // 1 = Latin, 2 = Japanese, 3 = Korean, 4 = Simplified Chinese, 5 = Traditional Chinese
            font._$languageCode = this.byteStream.getUI8();

            const FontNameLen = this.byteStream.getUI8();
            if (FontNameLen) {

                const startOffset = this.byteStream.byte_offset | 0;
                font._$fontName = this.getFontName(this.byteStream.getDataUntil());

                this.byteStream.byte_offset = startOffset + FontNameLen | 0;
            }

            numGlyphs        = this.byteStream.getUI16();
            font._$numGlyphs = numGlyphs;
        }

        // offset
        const offset = this.byteStream.byte_offset | 0;
        if (tag_type === 10) {
            numGlyphs = this.byteStream.getUI16();
        }

        if (numGlyphs) {

            const OffsetTable = [];
            if (tag_type === 10) {
                OffsetTable[0] = numGlyphs;
                numGlyphs /= 2;
                numGlyphs -= 1;
            }

            let CodeTableOffset = 0;
            switch (wideOffsets) {

                case 1:

                    for (let i = 0; i < numGlyphs; ++i) {
                        OffsetTable[OffsetTable.length] = this.byteStream.getUI32();
                    }

                    if (tag_type !== 10) {
                        CodeTableOffset = this.byteStream.getUI32();
                    }

                    break;

                default:

                    for (let i = 0; i < numGlyphs; ++i) {
                        OffsetTable[OffsetTable.length] = this.byteStream.getUI16();
                    }

                    if (tag_type !== 10) {
                        CodeTableOffset = this.byteStream.getUI16();
                    }

                    break;
            }

            // Shape
            const GlyphShapeTable = [];
            if (tag_type === 10) {
                numGlyphs += 1;
            }

            for (let i = 0; i < numGlyphs; ++i) {

                this.byteStream.setOffset(OffsetTable[i] + offset, 0);

                const numBits     = this.byteStream.getUI8();
                const NumFillBits = numBits >> 4;
                const NumLineBits = numBits & 0x0f;

                const currentNumBits = {
                    "FillBits": NumFillBits,
                    "LineBits": NumLineBits
                };

                GlyphShapeTable[GlyphShapeTable.length] = this.shapeRecords(tag_type, currentNumBits);

            }
            font._$glyphShapeTable = GlyphShapeTable;

            switch (tag_type) {

                case 48:
                case 75:

                    this.byteStream.setOffset(CodeTableOffset + offset, 0);
                    switch (wideCodes) {

                        case 1:
                            {
                                const CodeTable = new Uint16Array(numGlyphs);
                                for (let i = 0; i < numGlyphs; ++i) {
                                    CodeTable[i] = this.byteStream.getUI16();
                                }
                                font._$codeTable = CodeTable;
                            }
                            break;

                        default:
                            {
                                const CodeTable = new Uint8Array(numGlyphs);
                                for (let i = 0; i < numGlyphs; ++i) {
                                    CodeTable[i] = this.byteStream.getUI8();
                                }
                                font._$codeTable = CodeTable;
                            }
                            break;

                    }

                    if (font._$hasLayout) {

                        font._$ascent  = this.byteStream.getUI16();
                        font._$descent = this.byteStream.getUI16();
                        font._$leading = this.byteStream.getUI16();

                        const FontAdvanceTable = new Uint16Array(numGlyphs);
                        for (let i = 0; i < numGlyphs; ++i) {
                            FontAdvanceTable[i] = this.byteStream.getUI16();
                        }
                        font._$advanceTable = FontAdvanceTable;

                        const FontBoundsTable = [];
                        for (let i = 0; i < numGlyphs; ++i) {
                            FontBoundsTable[FontBoundsTable.length] = this.rect();
                        }
                        // TODO not use?
                        // font._$boundsTable = FontBoundsTable;

                        if (tag_type === 75) {

                            const count = this.byteStream.getUI16();

                            const kRecord = [];
                            for (let i = 0; i < count; ++i) {

                                const FontKerningCode1 = wideCodes ? this.byteStream.getUI16() : this.byteStream.getUI8();
                                const FontKerningCode2 = wideCodes ? this.byteStream.getUI16() : this.byteStream.getUI8();
                                const FontKerningAdjustment = this.byteStream.getSIBits(16);

                                kRecord[kRecord.length] = {
                                    "FontKerningCode1":      FontKerningCode1,
                                    "FontKerningCode2":      FontKerningCode2,
                                    "FontKerningAdjustment": FontKerningAdjustment
                                };
                            }

                            font._$kerningRecords = kRecord;
                        }
                    }
                    break;

                default:
                    break;

            }

        }

        this.byteStream.byte_offset = endOffset | 0;

        this.setFont(FontId, font);
    }

    /**
     * @param   {number} tag_type
     * @param   {number} length
     * @returns void
     */
    parseDefineFontInfo (tag_type, length)
    {

        const endOffset = this.byteStream.byte_offset + length | 0;

        const FontId = this.byteStream.getUI16();

        let font = this.getFont(FontId);
        if (!font) {
            font = {};
        }

        const len  = this.byteStream.getUI8();
        const data = this.byteStream.getData(len);

        let str = "";
        for (let i = 0; i < len; ++i) {

            if (data[i] > 127) {
                continue;
            }

            str += String.fromCharCode(data[i]);

        }

        this.byteStream.getUIBits(2); // Reserved

        font._$smallText = this.byteStream.getUIBits(1);
        font._$shiftJIS  = this.byteStream.getUIBits(1);
        font._$ANSI      = this.byteStream.getUIBits(1);
        font._$italic    = this.byteStream.getUIBits(1);
        font._$bold      = this.byteStream.getUIBits(1);

        const FontFlagsWideCodes = this.byteStream.getUIBits(1);

        if (tag_type === 62) {
            font._$languageCode = this.byteStream.getUI8();
        }

        const fontName = font._$shiftJIS || font._$languageCode === 2
            ? Util.$decodeToShiftJis(str)
            : decodeURIComponent(str);

        font._$fontName = this.getFontName(fontName);

        this.byteStream.byteAlign();

        const CodeTable = [];

        let codeTables = null;
        switch (true) {

            case FontFlagsWideCodes === 1 || tag_type === 62:

                while (this.byteStream.byte_offset < endOffset) {
                    CodeTable[CodeTable.length] = this.byteStream.getUI16();
                }
                codeTables = new Uint16Array(CodeTable);
                break;

            default:
                while (this.byteStream.byte_offset < endOffset) {
                    CodeTable[CodeTable.length] = this.byteStream.getUI8();
                }
                codeTables = new Uint8Array(CodeTable);
                break;

        }
        font._$codeTable = codeTables;

        this.setFont(FontId, font);

    }

    /**
     * @param   {string} font_name
     * @returns {string}
     * @public
     */
    getFontName (font_name)
    {

        const length = font_name.length | 0;
        const str    = font_name.substr(length - 1);
        if (str.charCodeAt(0) === 0) {
            font_name = font_name.slice(0, -1);
        }

        switch (font_name) {

            case "_sans":
                return "_sans";

            case "_serif":
                return "_serif";

            case "_typewriter":
                return "_typewriter";

            case "_等幅":
                return "Osaka";

            default:
            {
                const ander = font_name.substr(0, 1);
                if (ander === "_") {
                    return "sans-serif";
                }
                return font_name;
            }
        }
    }

    /**
     * @returns void
     * @public
     */
    parseDefineFontName ()
    {
        this.byteStream.getUI16(); // FontId
        this.byteStream.getDataUntil(); // FontName
        this.byteStream.getDataUntil(); // FontCopyright
    }

    /**
     * @param   {number} tag_type
     * @returns void
     * @public
     */
    parseDefineText (tag_type)
    {
        const staticText = {};

        // init
        staticText._$name         = "StaticText";
        staticText._$characterId  = this.byteStream.getUI16() | 0;
        staticText._$bounds       = this.rect();
        staticText._$baseMatrix   = this.matrix();
        staticText._$shapeRecords = null;

        // text records
        const GlyphBits           = this.byteStream.getUI8();
        const AdvanceBits         = this.byteStream.getUI8();
        staticText._$textRecords  = this.getTextRecords(tag_type, GlyphBits, AdvanceBits);

        this.setCharacter(staticText._$characterId, staticText);
    }

    /**
     * @param   {number} tag_type
     * @param   {number} glyph_bits
     * @param   {number} advance_bits
     * @returns {array}
     * @public
     */
    getTextRecords (tag_type, glyph_bits, advance_bits)
    {

        const records = [];

        while (this.byteStream.getUI8() !== 0) {

            this.byteStream.incrementOffset(-1, 0);

            const obj                = {};
            obj.TextRecordType       = this.byteStream.getUIBits(1);
            obj.StyleFlagsReserved   = this.byteStream.getUIBits(3);
            obj.StyleFlagsHasFont    = this.byteStream.getUIBits(1);
            obj.StyleFlagsHasColor   = this.byteStream.getUIBits(1);
            obj.StyleFlagsHasYOffset = this.byteStream.getUIBits(1);
            obj.StyleFlagsHasXOffset = this.byteStream.getUIBits(1);

            if (obj.StyleFlagsHasFont) {
                obj.FontId = this.byteStream.getUI16();
            }

            if (obj.StyleFlagsHasColor) {
                if (tag_type === 11) {
                    obj.TextColor = this.rgb();
                } else {
                    obj.TextColor = this.rgba();
                }
            }

            if (obj.StyleFlagsHasXOffset) {
                obj.XOffset = this.byteStream.getUI16() / 20;
            }

            if (obj.StyleFlagsHasYOffset) {
                obj.YOffset = this.byteStream.getUI16() / 20;
            }

            if (obj.StyleFlagsHasFont) {
                obj.TextHeight = this.byteStream.getUI16();
            }

            obj.GlyphCount   = this.byteStream.getUI8();
            obj.GlyphEntries = this.getGlyphEntries(obj.GlyphCount, glyph_bits, advance_bits);

            records[records.length] = obj;
        }

        return records;
    }

    /**
     * @param   {number} count
     * @param   {number} glyph_bits
     * @param   {number} advance_bits
     * @returns {array}
     * @public
     */
    getGlyphEntries (count, glyph_bits, advance_bits)
    {
        const entries = [];
        for (let i = 0; i < count; ++i) {
            entries[entries.length] = {
                "GlyphIndex":   this.byteStream.getUIBits(glyph_bits),
                "GlyphAdvance": this.byteStream.getSIBits(advance_bits) / 20
            };
        }

        return entries;
    }

    /**
     * @returns void
     * @public
     */
    parseDefineEditText ()
    {
        const textField  = {};

        // init
        textField._$ns   = ["flash", "text"];
        textField._$name = "TextField";

        const textFormat = {};

        const characterId = this.byteStream.getUI16();
        textField._$characterId = characterId;

        // rect
        textField._$bounds = this.rect();

        const flag1                   = this.byteStream.getUI8();
        const HasText                 = flag1 >>> 7 & 1;
        textField._$wordWrap          = flag1 >>> 6 & 1;
        textField._$multiline         = flag1 >>> 5 & 1;
        textField._$displayAsPassword = flag1 >>> 4 & 1;
        const ReadOnly                = flag1 >>> 3 & 1;

        textField._$type = "dynamic";
        if (!ReadOnly) {
            textField._$type = "input";
        }
        const HasTextColor          = flag1 >>> 2 & 1;
        const HasMaxLength          = flag1 >>> 1 & 1;
        const HasFont               = flag1 & 1;

        const flag2            = this.byteStream.getUI8();
        const HasFontClass     = flag2 >>> 7 & 1;
        // const AutoSize         = flag2 >>> 6 & 1;
        const HasLayout        = flag2 >>> 5 & 1;
        textField._$selectable = flag2 >>> 4 & 1;
        textField._$border     = flag2 >>> 3 & 1;
        // const WasStatic        = flag2 >>> 2 & 1;
        const HasHTML          = flag2 >>> 1 & 1;
        const UseOutLine       = flag2 & 1;

        if (textField._$border) {
            textField._$background = true;
        }

        let isJis = 0;
        if (HasFont) {
            const FontID = this.byteStream.getUI16();
            const font   = this.getFont(FontID);
            if (font) {

                isJis = font._$shiftJIS;

                if (HasFontClass) {
                    const FontClass = this.byteStream.getDataUntil();
                    console.log("TODO HasFontClass: ", FontClass);
                }

                // TextFormat
                textFormat._$font  = font._$fontName;
                textFormat._$size  = this.byteStream.getUI16() / 20;

                // TextField
                textField._$fontId = FontID | 0;

                // set embed font
                textField._$embedFonts =
                    (UseOutLine || font.fontType === "embedded") && !textField.displayAsPassword
                        ? true : false;
            }
        }

        if (HasTextColor) {
            const rgba = this.rgba();
            textField._$textColor = (rgba.R << 16)
                + (rgba.G << 8)
                    + rgba.B
                        + rgba.A * 255 * 16777216;
        }

        if (HasMaxLength) {
            textField._$maxChars = this.byteStream.getUI16();
        }

        if (HasLayout) {

            const Align = this.byteStream.getUI8();
            switch (Align) {

                case 0:
                    textFormat._$align = "left";
                    break;

                case 1:
                    textFormat._$align = "right";
                    break;

                case 2:
                    textFormat._$align = "center";
                    break;

                case 3:
                    textFormat._$align = "justify";
                    break;

            }

            textFormat._$leftMargin  = this.byteStream.getUI16() / 20;
            textFormat._$rightMargin = this.byteStream.getUI16() / 20;

            textFormat._$indent = this.byteStream.getUI16();
            if (textFormat._$indent >= 0x8000) {
                textFormat._$indent -= 0x10000;
            }

            textFormat._$leading = this.byteStream.getUI16();
            if (textFormat._$leading >= 0x8000) {
                textFormat._$leading -= 0x10000;
            }

            textFormat._$indent  /= 20;
            textFormat._$leading /= 20;

        }

        const VariableName = this.byteStream.getDataUntil(isJis) + "";

        textField._$text = "";
        if (HasText) {

            const text = this.byteStream.getDataUntil(isJis);
            switch (true) {

                case HasHTML === 1:
                    textField._$htmlText = text;
                    textField._$initText = true;
                    break;

                default:
                    textField._$text = text;
                    break;

            }

        }

        if (VariableName !== "") {
            console.log("VariableName: ", VariableName);
        }

        textField._$defaultTextFormat = [null,
            textFormat._$font, textFormat._$size, textFormat._$color,
            textFormat._$bold, textFormat._$italic, textFormat._$underline, textFormat._$url,
            textFormat._$target, textFormat._$align, textFormat._$leftMargin,
            textFormat._$rightMargin, 0, textFormat._$leading, textFormat._$indent
        ];

        this.setCharacter(characterId, textField);

    }

    /**
     * @param  {number} tag_type
     * @return void
     * @public
     */
    parseDefineMorphShape (tag_type)
    {
        const obj = {};

        obj.CharacterId = this.byteStream.getUI16();
        obj.StartBounds = this.rect();
        obj.EndBounds   = this.rect();

        if (tag_type === 84) {
            obj.StartEdgeBounds = this.rect();
            obj.EndEdgeBounds   = this.rect();

            this.byteStream.getUIBits(6); // Reserved

            obj.UsesNonScalingStrokes = this.byteStream.getUIBits(1);
            obj.UsesScalingStrokes    = this.byteStream.getUIBits(1);
        }

        const offset    = this.byteStream.getUI32();
        const endOffset = this.byteStream.byte_offset + offset;

        obj.MorphFillStyles = this.fillStyleArray(tag_type);
        obj.MorphLineStyles = this.lineStyleArray(tag_type);

        obj.StartEdges = this.shapeWithStyle(tag_type);
        if (this.byteStream.byte_offset !== endOffset) {
            this.byteStream.byte_offset = endOffset;
        }

        obj.EndEdges = this.shapeWithStyle(tag_type);

        // fill1 control
        const startPosition     = { "x": 0, "y": 0 };
        const endPosition       = { "x": 0, "y": 0 };
        const StartRecords      = obj.StartEdges.ShapeData.records;
        const EndRecords        = obj.EndEdges.ShapeData.records;
        const StartRecordLength = StartRecords.length;
        const EndRecordLength   = EndRecords.length;

        let length = Math.max(StartRecordLength, EndRecordLength);

        const newStartRecords = [];
        const newEndRecords   = [];
        let sIdx = 0;
        let eIdx = 0;
        while (length > sIdx || length > eIdx) {

            const StartRecord = StartRecords[sIdx++];
            const EndRecord   = EndRecords[eIdx++];
            if (StartRecord === -1 && EndRecord === -1) {
                break;
            }

            switch (true) {

                case StartRecord === -1:
                case StartRecord === undefined:

                    // change data
                    if (EndRecord) {

                        const newStyles = EndRecords[eIdx++];
                        newEndRecords.push(1, newStyles);
                        newStartRecords.push(1, newStyles);
                        if (newStyles) {
                            const NumFillBits = EndRecords[eIdx++]; // 0 only?
                            const NumLineBits = EndRecords[eIdx++]; // 0 only?
                            newEndRecords.push(NumFillBits, NumLineBits);
                            newStartRecords.push(NumFillBits, NumLineBits);
                            console.log("TODO Parse Morph NewStyles");
                        }

                        const stateMoveTo = EndRecords[eIdx++];
                        newEndRecords.push(stateMoveTo);
                        newStartRecords.push(stateMoveTo);
                        if (stateMoveTo) {
                            const MoveX   = EndRecords[eIdx++];
                            const MoveY   = EndRecords[eIdx++];
                            endPosition.x = MoveX;
                            endPosition.y = MoveY;
                            newEndRecords.push(MoveX, MoveY);
                            newStartRecords.push(MoveX, MoveY);
                        }

                        const stateFillStyle0 = EndRecords[eIdx++];
                        newEndRecords.push(stateFillStyle0);
                        newStartRecords.push(stateFillStyle0);
                        if (stateFillStyle0) {
                            const FillStyle0 = EndRecords[eIdx++];
                            newEndRecords.push(FillStyle0);
                            newStartRecords.push(FillStyle0);
                        }

                        const stateFillStyle1 = EndRecords[eIdx++];
                        newEndRecords.push(stateFillStyle1);
                        newStartRecords.push(stateFillStyle1);
                        if (stateFillStyle1) {
                            const FillStyle1 = EndRecords[eIdx++];
                            newEndRecords.push(FillStyle1);
                            newStartRecords.push(FillStyle1);
                        }

                        const stateLineStyle = EndRecords[eIdx++];
                        newEndRecords.push(stateLineStyle);
                        newStartRecords.push(stateLineStyle);
                        if (stateLineStyle) {
                            const LineStyle = EndRecords[eIdx++];
                            newEndRecords.push(LineStyle);
                            newStartRecords.push(LineStyle);
                        }

                        break;
                    }

                    if (EndRecords[eIdx++]) {
                        // curve
                        const ControlX = EndRecords[eIdx++];
                        const ControlY = EndRecords[eIdx++];
                        const AnchorX  = EndRecords[eIdx++];
                        const AnchorY  = EndRecords[eIdx++];
                        endPosition.x += ControlX + AnchorX;
                        endPosition.y += ControlY + AnchorY;
                        newEndRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                        newStartRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                    } else {
                        // line
                        const AnchorX = EndRecords[eIdx++];
                        const AnchorY = EndRecords[eIdx++];
                        endPosition.x += AnchorX;
                        endPosition.y += AnchorY;
                        newEndRecords.push(0, 0, AnchorX, AnchorY);
                        newStartRecords.push(0, 0, AnchorX, AnchorY);
                    }

                    break;

                case EndRecord === -1:
                case EndRecord === undefined:

                    if (StartRecord) {

                        const newStyles = StartRecords[sIdx++];
                        newEndRecords.push(1, newStyles);
                        newStartRecords.push(1, newStyles);
                        if (newStyles) {
                            const NumFillBits = StartRecords[sIdx++]; // 0 only?
                            const NumLineBits = StartRecords[sIdx++]; // 0 only?
                            newEndRecords.push(NumFillBits, NumLineBits);
                            newStartRecords.push(NumFillBits, NumLineBits);
                            console.log("TODO Parse Morph NewStyles");
                        }

                        const stateMoveTo = StartRecords[sIdx++];
                        newEndRecords.push(stateMoveTo);
                        newStartRecords.push(stateMoveTo);
                        if (stateMoveTo) {
                            const MoveX     = StartRecords[sIdx++];
                            const MoveY     = StartRecords[sIdx++];
                            startPosition.x = MoveX;
                            startPosition.y = MoveY;
                            newEndRecords.push(MoveX, MoveY);
                            newStartRecords.push(MoveX, MoveY);
                        }

                        const stateFillStyle0 = StartRecords[sIdx++];
                        newEndRecords.push(stateFillStyle0);
                        newStartRecords.push(stateFillStyle0);
                        if (stateFillStyle0) {
                            const FillStyle0 = StartRecords[sIdx++];
                            newEndRecords.push(FillStyle0);
                            newStartRecords.push(FillStyle0);
                        }

                        const stateFillStyle1 = StartRecords[sIdx++];
                        newEndRecords.push(stateFillStyle1);
                        newStartRecords.push(stateFillStyle1);
                        if (stateFillStyle1) {
                            const FillStyle1 = StartRecords[sIdx++];
                            newEndRecords.push(FillStyle1);
                            newStartRecords.push(FillStyle1);
                        }

                        const stateLineStyle = StartRecords[sIdx++];
                        newEndRecords.push(stateLineStyle);
                        newStartRecords.push(stateLineStyle);
                        if (stateLineStyle) {
                            const LineStyle = StartRecords[sIdx++];
                            newEndRecords.push(LineStyle);
                            newStartRecords.push(LineStyle);
                        }

                        break;
                    }

                    if (StartRecords[sIdx++]) {
                        // curve
                        const ControlX   = StartRecords[sIdx++];
                        const ControlY   = StartRecords[sIdx++];
                        const AnchorX    = StartRecords[sIdx++];
                        const AnchorY    = StartRecords[sIdx++];
                        startPosition.x += ControlX + AnchorX;
                        startPosition.y += ControlY + AnchorY;
                        newEndRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                        newStartRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                    } else {
                        // line
                        const AnchorX = StartRecords[eIdx++];
                        const AnchorY = StartRecords[eIdx++];
                        startPosition.x += AnchorX;
                        startPosition.y += AnchorY;
                        newEndRecords.push(0, 0, AnchorX, AnchorY);
                        newStartRecords.push(0, 0, AnchorX, AnchorY);
                    }

                    break;

                case StartRecord === 1 && EndRecord === 1:

                    const newStartStyles = StartRecords[sIdx++];
                    newStartRecords.push(1, newStartStyles);
                    if (newStartStyles) {
                        const NumFillBits = StartRecords[sIdx++]; // 0 only?
                        const NumLineBits = StartRecords[sIdx++]; // 0 only?
                        newStartRecords.push(NumFillBits, NumLineBits);
                        console.log("TODO Parse Morph NewStyles");
                    }

                    const stateStartMoveTo = StartRecords[sIdx++];
                    newStartRecords.push(stateStartMoveTo);
                    if (stateStartMoveTo) {
                        const MoveX     = StartRecords[sIdx++];
                        const MoveY     = StartRecords[sIdx++];
                        startPosition.x = MoveX;
                        startPosition.y = MoveY;
                        newStartRecords.push(MoveX, MoveY);
                    }

                    const stateStartFillStyle0 = StartRecords[sIdx++];
                    newStartRecords.push(stateStartFillStyle0);
                    if (stateStartFillStyle0) {
                        const FillStyle0 = StartRecords[sIdx++];
                        newStartRecords.push(FillStyle0);
                    }

                    const stateStartFillStyle1 = StartRecords[sIdx++];
                    newStartRecords.push(stateStartFillStyle1);
                    if (stateStartFillStyle1) {
                        const FillStyle1 = StartRecords[sIdx++];
                        newStartRecords.push(FillStyle1);
                    }

                    const stateStartLineStyle = StartRecords[sIdx++];
                    newStartRecords.push(stateStartLineStyle);
                    if (stateStartLineStyle) {
                        const LineStyle = StartRecords[sIdx++];
                        newStartRecords.push(LineStyle);
                    }

                    const newEndStyles = EndRecords[eIdx++];
                    newEndRecords.push(1, newEndStyles);
                    if (newEndStyles) {
                        const NumFillBits = EndRecords[eIdx++]; // 0 only?
                        const NumLineBits = EndRecords[eIdx++]; // 0 only?
                        newEndRecords.push(NumFillBits, NumLineBits);
                        console.log("TODO Parse Morph NewStyles");
                    }

                    const stateEndMoveTo = EndRecords[eIdx++];
                    newEndRecords.push(stateEndMoveTo);
                    if (stateEndMoveTo) {
                        const MoveX     = EndRecords[eIdx++];
                        const MoveY     = EndRecords[eIdx++];
                        startPosition.x = MoveX;
                        startPosition.y = MoveY;
                        newEndRecords.push(MoveX, MoveY);
                    }

                    const stateEndFillStyle0 = EndRecords[eIdx++];
                    newEndRecords.push(stateEndFillStyle0);
                    if (stateEndFillStyle0) {
                        const FillStyle0 = EndRecords[eIdx++];
                        newEndRecords.push(FillStyle0);
                    }

                    const stateEndFillStyle1 = EndRecords[eIdx++];
                    newEndRecords.push(stateEndFillStyle1);
                    if (stateEndFillStyle1) {
                        const FillStyle1 = EndRecords[eIdx++];
                        newEndRecords.push(FillStyle1);
                    }

                    const stateEndLineStyle = EndRecords[eIdx++];
                    newEndRecords.push(stateEndLineStyle);
                    if (stateEndLineStyle) {
                        const LineStyle = EndRecords[eIdx++];
                        newEndRecords.push(LineStyle);
                    }

                    break;

                case StartRecord === 0 && EndRecord === 0: // no change

                    if (StartRecords[sIdx++]) {
                        const ControlX   = StartRecords[sIdx++];
                        const ControlY   = StartRecords[sIdx++];
                        const AnchorX    = StartRecords[sIdx++];
                        const AnchorY    = StartRecords[sIdx++];
                        startPosition.x  = AnchorX;
                        startPosition.y  = AnchorY;
                        newStartRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                    } else {
                        const AnchorX    = StartRecords[sIdx++];
                        const AnchorY    = StartRecords[sIdx++];
                        startPosition.x  = AnchorX;
                        startPosition.y  = AnchorY;
                        newStartRecords.push(0, 0, AnchorX, AnchorY);
                    }

                    if (EndRecords[eIdx++]) {
                        const ControlX = EndRecords[eIdx++];
                        const ControlY = EndRecords[eIdx++];
                        const AnchorX  = EndRecords[eIdx++];
                        const AnchorY  = EndRecords[eIdx++];
                        endPosition.x  = AnchorX;
                        endPosition.y  = AnchorY;
                        newEndRecords.push(0, 1, ControlX, ControlY, AnchorX, AnchorY);
                    } else {
                        const AnchorX  = EndRecords[eIdx++];
                        const AnchorY  = EndRecords[eIdx++];
                        endPosition.x  = AnchorX;
                        endPosition.y  = AnchorY;
                        newEndRecords.push(0, 0, AnchorX, AnchorY);
                    }

                    break;

                case StartRecord === 1 && EndRecord === 0:
                    {
                        const newStyles = StartRecords[sIdx++];
                        newEndRecords.push(1, newStyles);
                        newStartRecords.push(1, newStyles);
                        if (newStyles) {
                            const NumFillBits = StartRecords[sIdx++]; // 0 only?
                            const NumLineBits = StartRecords[sIdx++]; // 0 only?
                            newEndRecords.push(NumFillBits, NumLineBits);
                            newStartRecords.push(NumFillBits, NumLineBits);
                            console.log("TODO Parse Morph NewStyles");
                        }

                        const stateMoveTo = StartRecords[sIdx++];
                        newEndRecords.push(stateMoveTo);
                        newStartRecords.push(stateMoveTo);
                        if (stateMoveTo) {
                            const MoveX     = StartRecords[sIdx++];
                            const MoveY     = StartRecords[sIdx++];
                            startPosition.x = MoveX;
                            startPosition.y = MoveY;
                            newEndRecords.push(MoveX, MoveY);
                            newStartRecords.push(MoveX, MoveY);
                        }

                        const stateFillStyle0 = StartRecords[sIdx++];
                        newEndRecords.push(stateFillStyle0);
                        newStartRecords.push(stateFillStyle0);
                        if (stateFillStyle0) {
                            const FillStyle0 = StartRecords[sIdx++];
                            newEndRecords.push(FillStyle0);
                            newStartRecords.push(FillStyle0);
                        }

                        const stateFillStyle1 = StartRecords[sIdx++];
                        newEndRecords.push(stateFillStyle1);
                        newStartRecords.push(stateFillStyle1);
                        if (stateFillStyle1) {
                            const FillStyle1 = StartRecords[sIdx++];
                            newEndRecords.push(FillStyle1);
                            newStartRecords.push(FillStyle1);
                        }

                        const stateLineStyle = StartRecords[sIdx++];
                        newEndRecords.push(stateLineStyle);
                        newStartRecords.push(stateLineStyle);
                        if (stateLineStyle) {
                            const LineStyle = StartRecords[sIdx++];
                            newEndRecords.push(LineStyle);
                            newStartRecords.push(LineStyle);
                        }

                        --eIdx;
                    }

                    break;

                case StartRecord === 0 && EndRecord === 1:
                    {
                        const newStyles = EndRecords[eIdx++];
                        newEndRecords.push(1, newStyles);
                        newStartRecords.push(1, newStyles);
                        if (newStyles) {
                            const NumFillBits = EndRecords[eIdx++]; // 0 only?
                            const NumLineBits = EndRecords[eIdx++]; // 0 only?
                            newEndRecords.push(NumFillBits, NumLineBits);
                            newStartRecords.push(NumFillBits, NumLineBits);
                            console.log("TODO Parse Morph NewStyles");
                        }

                        const stateMoveTo = EndRecords[eIdx++];
                        newEndRecords.push(stateMoveTo);
                        newStartRecords.push(stateMoveTo);
                        if (stateMoveTo) {
                            const MoveX   = EndRecords[eIdx++];
                            const MoveY   = EndRecords[eIdx++];
                            endPosition.x = MoveX;
                            endPosition.y = MoveY;
                            newEndRecords.push(MoveX, MoveY);
                            newStartRecords.push(MoveX, MoveY);
                        }

                        const stateFillStyle0 = EndRecords[eIdx++];
                        newEndRecords.push(stateFillStyle0);
                        newStartRecords.push(stateFillStyle0);
                        if (stateFillStyle0) {
                            const FillStyle0 = EndRecords[eIdx++];
                            newEndRecords.push(FillStyle0);
                            newStartRecords.push(FillStyle0);
                        }

                        const stateFillStyle1 = EndRecords[eIdx++];
                        newEndRecords.push(stateFillStyle1);
                        newStartRecords.push(stateFillStyle1);
                        if (stateFillStyle1) {
                            const FillStyle1 = EndRecords[eIdx++];
                            newEndRecords.push(FillStyle1);
                            newStartRecords.push(FillStyle1);
                        }

                        const stateLineStyle = EndRecords[eIdx++];
                        newEndRecords.push(stateLineStyle);
                        newStartRecords.push(stateLineStyle);
                        if (stateLineStyle) {
                            const LineStyle = EndRecords[eIdx++];
                            newEndRecords.push(LineStyle);
                            newStartRecords.push(LineStyle);
                        }

                        --sIdx;
                    }

                    break;

                default:
                    break;

            }

        }

        newStartRecords.push(-1);
        newEndRecords.push(-1);
        obj.StartEdges.ShapeData.records = new Int32Array(newStartRecords);
        obj.EndEdges.ShapeData.records   = new Int32Array(newEndRecords);

        this.setCharacter(obj.CharacterId, {
            "_$ns":              ["flash", "display"],
            "_$name":            "MorphShape",
            "_$characterId":     obj.CharacterId,
            "_$endBounds":       obj.EndBounds,
            "_$endEdges":        obj.EndEdges,
            "_$fillStyles":      obj.MorphFillStyles,
            "_$lineStyles":      obj.MorphLineStyles,
            "_$startBounds":     obj.StartBounds,
            "_$startEdges":      obj.StartEdges,
            "_$shapes":          null,
            "_$frameData":       [],
            "_$frameCreated":    false
        }, [
            obj.StartEdges.ShapeData.records.buffer,
            obj.EndEdges.ShapeData.records.buffer
        ]);
    }

    /**
     * @return {{name: string, frame: number}}
     * @public
     */
    parseFrameLabel ()
    {
        return {
            "name":  this.byteStream.getDataUntil(),
            "frame": 0
        };
    }

    /**
     * @param  {number} tag_type
     * @param  {number} length
     * @return void
     * @public
     */
    parseDefineButton (tag_type, length)
    {

        const endOffset = this.byteStream.byte_offset + length | 0;

        // create SimpleButton
        const button = {};

        button._$ns   = ["flash", "display"];
        button._$name = "SimpleButton";

        // characterId
        button._$characterId     = this.byteStream.getUI16() | 0;

        let offset = 0;
        if (tag_type !== 7) {
            // Reserved
            this.byteStream.getUIBits(7);

            button._$trackAsMenu = this.byteStream.getUIBits(1) ? true : false;

            offset = this.byteStream.getUI16() | 0;
        }

        // action characters
        button._$characters = this.buttonCharacters(endOffset);

        // actionScript
        if (tag_type === 7) {

            offset = endOffset - this.byteStream.byte_offset | 0;

            this.byteStream.byte_offset += offset;

        } else if (offset > 0) {
            button._$actions = this.buttonActions(endOffset);
        }

        // set layer
        this.setCharacter(button._$characterId, button);

        if (this.byteStream.byte_offset !== endOffset) {
            this.byteStream.byte_offset = endOffset | 0;
        }
    }

    /**
     * @param   {number} offset
     * @returns {array}
     * @public
     */
    buttonCharacters (offset)
    {
        const characters = [];
        while (this.byteStream.getUI8() !== 0) {

            this.byteStream.incrementOffset(-1, 0);

            const cacheOffset = this.byteStream.byte_offset | 0;

            const record = this.buttonRecord();

            // prev
            if (this.byteStream.byte_offset > offset) {
                this.byteStream.byte_offset = cacheOffset | 0;
                break;
            }

            characters[characters.length] = record;
        }

        return characters;
    }

    /**
     * @returns {object}
     * @public
     */
    buttonRecord ()
    {

        this.byteStream.getUIBits(2); // Reserved

        const obj = {};

        obj.PlaceFlagHasBlendMode  = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasFilterList = this.byteStream.getUIBits(1);
        obj.ButtonStateHitTest     = this.byteStream.getUIBits(1);
        obj.ButtonStateDown        = this.byteStream.getUIBits(1);
        obj.ButtonStateOver        = this.byteStream.getUIBits(1);
        obj.ButtonStateUp          = this.byteStream.getUIBits(1);
        obj.CharacterId            = this.byteStream.getUI16();
        obj.Depth                  = this.byteStream.getUI16();
        obj.PlaceFlagHasMatrix     = 1;
        obj.Matrix                 = this.matrix();
        obj.ColorTransform         = this.colorTransform();

        obj.PlaceFlagHasColorTransform = obj.ColorTransform === undefined ? 0 : 1;
        if (obj.PlaceFlagHasBlendMode) {
            obj.BlendMode = this.byteStream.getUI8();
        }

        if (obj.PlaceFlagHasFilterList) {
            obj.SurfaceFilterList = this.getFilterList();
        }

        obj.PlaceFlagHasRatio     = 0;
        obj.PlaceFlagHasClipDepth = 0;
        obj.Sound                 = null;

        return obj;
    }

    /**
     * @param   {number} end_offset
     * @returns {array}
     * @public
     */
    buttonActions (end_offset)
    {
        const actions = [];

        for (;;) {

            const obj            = {};
            const startOffset    = this.byteStream.byte_offset | 0;
            const CondActionSize = this.byteStream.getUI16();

            obj.CondIdleToOverDown    = this.byteStream.getUIBits(1);
            obj.CondOutDownToIdle     = this.byteStream.getUIBits(1);
            obj.CondOutDownToOverDown = this.byteStream.getUIBits(1);
            obj.CondOverDownToOutDown = this.byteStream.getUIBits(1);
            obj.CondOverDownToOverUp  = this.byteStream.getUIBits(1);
            obj.CondOverUpToOverDown  = this.byteStream.getUIBits(1);
            obj.CondOverUpToIdle      = this.byteStream.getUIBits(1);
            obj.CondIdleToOverUp      = this.byteStream.getUIBits(1);
            obj.CondKeyPress          = this.byteStream.getUIBits(7);
            obj.CondOverDownToIdle    = this.byteStream.getUIBits(1);

            // ActionScript
            const length = end_offset - this.byteStream.byte_offset + 1 | 0;
            this.byteStream.byte_offset += length;

            if (!CondActionSize) {
                break;
            }

            this.byteStream.byte_offset = startOffset + CondActionSize | 0;
        }

        return actions;
    }

    /**
     * @param   {number} tag_type
     * @param   {number} length
     * @returns {object}
     * @public
     */
    parsePlaceObject (tag_type, length)
    {
        const startOffset = this.byteStream.byte_offset;

        const obj = {};
        obj.tagType = tag_type;

        if (tag_type === 4) {

            obj.CharacterId = this.byteStream.getUI16();
            obj.Depth       = this.byteStream.getUI16();
            obj.Matrix      = this.matrix();
            obj.PlaceFlagHasMatrix = 1;

            this.byteStream.byteAlign();

            if (this.byteStream.byte_offset - startOffset < length) {
                obj.ColorTransform = this.colorTransform();
                obj.PlaceFlagHasColorTransform = 1;
            }

            this.byteStream.byteAlign();

            this.byteStream.byte_offset = startOffset + length;

            return obj;

        }

        // PlaceObject2 or PlaceObject3
        const version = this.swfVersion;

        obj.PlaceFlagHasClipActions    = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasClipDepth      = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasName           = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasRatio          = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasColorTransform = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasMatrix         = this.byteStream.getUIBits(1);
        obj.PlaceFlagHasCharacter      = this.byteStream.getUIBits(1);
        obj.PlaceFlagMove              = this.byteStream.getUIBits(1);

        // PlaceObject3
        if (tag_type === 70) {

            this.byteStream.getUIBits(1); // Reserved

            obj.PlaceFlagOpaqueBackground = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasVisible       = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasImage         = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasClassName     = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasCacheAsBitmap = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasBlendMode     = this.byteStream.getUIBits(1);
            obj.PlaceFlagHasFilterList    = this.byteStream.getUIBits(1);

        }

        obj.Depth = this.byteStream.getUI16();

        if (obj.PlaceFlagHasClassName) {
            obj.ClassName = this.byteStream.getDataUntil();
            console.log("TODO ", obj.ClassName);
        }

        if (obj.PlaceFlagHasCharacter) {
            obj.CharacterId = this.byteStream.getUI16();
        }

        if (obj.PlaceFlagHasMatrix) {
            obj.Matrix = this.matrix();
        }

        if (obj.PlaceFlagHasColorTransform) {
            obj.ColorTransform = this.colorTransform();
        }

        if (obj.PlaceFlagHasRatio) {
            obj.Ratio = this.byteStream.getUI16();
        }

        if (obj.PlaceFlagHasName) {
            obj.Name = this.byteStream.getDataUntil();
        }

        if (obj.PlaceFlagHasClipDepth) {
            obj.ClipDepth = this.byteStream.getUI16();
        }

        if (tag_type === 70) {

            if (obj.PlaceFlagHasFilterList) {
                obj.SurfaceFilterList = this.getFilterList();
            }

            if (obj.PlaceFlagHasBlendMode) {
                obj.BlendMode = this.byteStream.getUI8();
            }

            if (obj.PlaceFlagHasCacheAsBitmap) {
                obj.BitmapCache = this.byteStream.getUI8();
            }

            if (obj.PlaceFlagHasVisible) {
                obj.Visible = this.byteStream.getUI8();
            }

            if (obj.PlaceFlagOpaqueBackground) {
                obj.BackgroundColor = this.rgba();
            }

        }

        if (obj.PlaceFlagHasClipActions) {

            this.byteStream.getUI16(); // Reserved

            obj.AllEventFlags = this.parseClipEventFlags();

            const endLength = startOffset + length;

            while (this.byteStream.byte_offset < endLength) {

                const clipActionRecord = this.parseClipActionRecord(endLength);
                if (endLength <= this.byteStream.byte_offset) {
                    break;
                }

                const endFlag = version <= 5
                    ? this.byteStream.getUI16()
                    : this.byteStream.getUI32();

                if (!endFlag) {
                    break;
                }

                if (version <= 5) {
                    this.byteStream.byte_offset -= 2;
                } else {
                    this.byteStream.byte_offset -= 4;
                }

                if (clipActionRecord.KeyCode) {
                    this.byteStream.byte_offset -= 1;
                }
            }
        }

        this.byteStream.byteAlign();

        this.byteStream.byte_offset = startOffset + length;

        return obj;
    }

    /**
     * @param  {number} end_length
     * @return {object}
     * @public
     */
    parseClipActionRecord (end_length)
    {

        const obj = {};
        const EventFlags = this.parseClipEventFlags();
        if (end_length > this.byteStream.byte_offset) {

            const ActionRecordSize = this.byteStream.getUI32();
            if (EventFlags.keyPress) {
                obj.KeyCode = this.byteStream.getUI8();
            }

            this.byteStream.byte_offset += ActionRecordSize;
        }

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    parseClipEventFlags ()
    {
        const version = this.swfVersion;

        const obj = {};

        obj.keyUp      = this.byteStream.getUIBits(1);
        obj.keyDown    = this.byteStream.getUIBits(1);
        obj.mouseUp    = this.byteStream.getUIBits(1);
        obj.mouseDown  = this.byteStream.getUIBits(1);
        obj.mouseMove  = this.byteStream.getUIBits(1);
        obj.unload     = this.byteStream.getUIBits(1);
        obj.enterFrame = this.byteStream.getUIBits(1);
        obj.load       = this.byteStream.getUIBits(1);

        if (version >= 6) {
            obj.dragOver       = this.byteStream.getUIBits(1);
            obj.rollOut        = this.byteStream.getUIBits(1);
            obj.rollOver       = this.byteStream.getUIBits(1);
            obj.releaseOutside = this.byteStream.getUIBits(1);
            obj.release        = this.byteStream.getUIBits(1);
            obj.press          = this.byteStream.getUIBits(1);
            obj.initialize     = this.byteStream.getUIBits(1);
        }

        obj.data = this.byteStream.getUIBits(1);

        if (version >= 6) {

            this.byteStream.getUIBits(5); // Reserved

            obj.construct = this.byteStream.getUIBits(1);
            obj.keyPress  = this.byteStream.getUIBits(1);
            obj.dragOut   = this.byteStream.getUIBits(1);

            this.byteStream.getUIBits(8); // Reserved
        }

        this.byteStream.byteAlign();

        return obj;
    }

    /**
     * @returns {array|null}
     * @public
     */
    getFilterList ()
    {
        const NumberOfFilters = this.byteStream.getUI8() | 0;

        const list = [];
        for (let i = 0; i < NumberOfFilters; ++i) {

            const filter = this.getFilter();
            if (filter) {
                list[list.length] = filter;
            }

        }

        return list.length ? list : null;
    }

    /**
     * @return {object|null}
     * @public
     */
    getFilter ()
    {
        const filterId = this.byteStream.getUI8() | 0;
        switch (filterId) {
            case 0:
                return this.dropShadowFilter();

            case 1:
                return this.blurFilter();

            case 2:
                return this.glowFilter();

            case 3:
                return this.bevelFilter();

            case 4:
                return this.gradientGlowFilter();

            case 5:
                return this.convolutionFilter();

            case 6:
                return this.colorMatrixFilter();

            case 7:
                return this.gradientBevelFilter();

        }
    }

    /**
     * @returns {object}
     * @public
     */
    dropShadowFilter ()
    {
        const obj = {};

        const rgba  = this.rgba();
        const alpha = rgba.A;
        const color = rgba.R << 16 | rgba.G << 8 | rgba.B;

        const blurX      = this.byteStream.getUI32() / 0x10000;
        const blurY      = this.byteStream.getUI32() / 0x10000;
        const angle      = this.byteStream.getUI32() / 0x10000 * Util.$Rad2Deg;
        const distance   = this.byteStream.getUI32() / 0x10000;
        const strength   = this.byteStream.getFloat16() / 256;
        const inner      = this.byteStream.getUIBits(1) ? true  : false;
        const knockout   = this.byteStream.getUIBits(1) ? true  : false;
        const hideObject = this.byteStream.getUIBits(1) ? false : true;
        const quality    = this.byteStream.getUIBits(5);

        obj._$ns   = ["flash", "filters"];
        obj._$name = "DropShadowFilter";
        obj.params = [null,
            distance, angle, color, alpha, blurX, blurY,
            strength, quality, inner, knockout, hideObject
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    blurFilter ()
    {
        const obj = {};

        const blurX   = this.byteStream.getUI32() / 0x10000;
        const blurY   = this.byteStream.getUI32() / 0x10000;
        const quality = this.byteStream.getUIBits(5);

        this.byteStream.getUIBits(3); // Reserved

        obj._$ns   = ["flash", "filters"];
        obj._$name = "BlurFilter";
        obj.params = [null, blurX, blurY, quality];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    glowFilter ()
    {
        const obj = {};

        const rgba     = this.rgba();
        const alpha    = rgba.A;
        const color    = rgba.R << 16 | rgba.G << 8 | rgba.B;
        const blurX    = this.byteStream.getUI32() / 0x10000;
        const blurY    = this.byteStream.getUI32() / 0x10000;
        const strength = this.byteStream.getFloat16() / 256;
        const inner    = this.byteStream.getUIBits(1) ? true : false;
        const knockout = this.byteStream.getUIBits(1) ? true : false;

        this.byteStream.getUIBits(1); // CompositeSource

        const quality = this.byteStream.getUIBits(5);

        obj._$ns   = ["flash", "filters"];
        obj._$name = "GlowFilter";
        obj.params = [null,
            color, alpha, blurX, blurY,
            strength, quality, inner, knockout
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    bevelFilter ()
    {
        const obj = {};

        let rgba = this.rgba();
        const highlightAlpha = rgba.A;
        const highlightColor = rgba.R << 16 | rgba.G << 8 | rgba.B;

        rgba = this.rgba();
        const shadowAlpha = rgba.A;
        const shadowColor = rgba.R << 16 | rgba.G << 8 | rgba.B;

        const blurX    = this.byteStream.getUI32() / 0x10000;
        const blurY    = this.byteStream.getUI32() / 0x10000;
        const angle    = this.byteStream.getUI32() / 0x10000 * Util.$Rad2Deg;
        const distance = this.byteStream.getUI32() / 0x10000;
        const strength = this.byteStream.getFloat16() / 256;
        const inner    = this.byteStream.getUIBits(1) ? true : false;
        const knockout = this.byteStream.getUIBits(1) ? true : false;

        this.byteStream.getUIBits(1); // CompositeSource

        const OnTop   = this.byteStream.getUIBits(1);
        const quality = this.byteStream.getUIBits(4);

        let type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        obj._$ns   = ["flash", "filters"];
        obj._$name = "BevelFilter";
        obj.params = [null,
            distance, angle, highlightColor, highlightAlpha,
            shadowColor, shadowAlpha, blurX, blurY,
            strength, quality, type, knockout
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    gradientGlowFilter ()
    {
        const obj = {};

        const NumColors = this.byteStream.getUI8() | 0;

        const colors = [];
        const alphas = [];

        for (let i = 0; i < NumColors; ++i) {
            const rgba = this.rgba();
            alphas[alphas.length] = rgba.A;
            colors[colors.length] = rgba.R << 16 | rgba.G << 8 | rgba.B | 0;
        }

        const ratios = [];
        for (let i = 0; i < NumColors; ++i) {
            ratios[ratios.length] = +(this.byteStream.getUI8() / 255);
        }

        const blurX    = this.byteStream.getUI32() / 0x10000;
        const blurY    = this.byteStream.getUI32() / 0x10000;
        const angle    = this.byteStream.getUI32() / 0x10000 * Util.$Rad2Deg;
        const distance = this.byteStream.getUI32() / 0x10000;
        const strength = this.byteStream.getFloat16() / 256;
        const inner    = this.byteStream.getUIBits(1) ? true : false;
        const knockout = this.byteStream.getUIBits(1) ? true : false;

        this.byteStream.getUIBits(1); // CompositeSource

        const OnTop   = this.byteStream.getUIBits(1);
        const quality = this.byteStream.getUIBits(4);

        let type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        obj._$ns   = ["flash", "filters"];
        obj._$name = "GradientGlowFilter";
        obj.params = [null,
            distance, angle, colors, alphas, ratios,
            blurX, blurY, strength, quality, type, knockout
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    convolutionFilter ()
    {
        const obj = {};

        const matrixX = this.byteStream.getUI8();
        const matrixY = this.byteStream.getUI8();
        const divisor = this.byteStream.getFloat32;
        const bias    = this.byteStream.getFloat32;

        // matrix
        const count  = matrixX * matrixY;
        const matrix = [];
        for (let idx = 0; idx < count; ++idx) {
            matrix[matrix.length] = this.byteStream.getFloat32();
        }

        const color = this.rgba();

        // Reserved
        this.byteStream.getUIBits(6);

        const clamp         = this.byteStream.getUIBits(1) ? true : false;
        const preserveAlpha = this.byteStream.getUIBits(1) ? true : false;

        obj._$ns   = ["flash", "filters"];
        obj._$name = "ConvolutionFilter";
        obj.params = [null,
            matrixX, matrixY, matrix, divisor, bias,
            preserveAlpha, clamp, color
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    gradientBevelFilter ()
    {
        const obj = {};

        const NumColors = this.byteStream.getUI8() | 0;

        const colors = [];
        const alphas = [];

        for (let i = 0; i < NumColors; ++i) {

            const rgba = this.rgba();

            alphas[alphas.length] = rgba.A;
            colors[colors.length] = rgba.R << 16 | rgba.G << 8 | rgba.B | 0;
        }

        const ratios = [];
        for (let i = 0; i < NumColors; ++i) {
            ratios[ratios.length] = +(this.byteStream.getUI8() / 255);
        }

        const blurX    = this.byteStream.getUI32() / 0x10000;
        const blurY    = this.byteStream.getUI32() / 0x10000;
        const angle    = this.byteStream.getUI32() / 0x10000 * Util.$Rad2Deg;
        const distance = this.byteStream.getUI32() / 0x10000;
        const strength = this.byteStream.getFloat16() / 256;
        const inner    = this.byteStream.getUIBits(1) ? true : false;
        const knockout = this.byteStream.getUIBits(1) ? true : false;

        this.byteStream.getUIBits(1); // CompositeSource

        const OnTop   = this.byteStream.getUIBits(1);
        const quality = this.byteStream.getUIBits(4);

        let type = "inner";
        if (!inner) {
            if (OnTop) {
                type = "full";
            } else {
                type = "outer";
            }
        }

        obj._$ns   = ["flash", "filters"];
        obj._$name = "GradientBevelFilter";
        obj.params = [null,
            distance, angle, colors, alphas, ratios,
            blurX, blurY, strength, quality, type, knockout
        ];

        return obj;
    }

    /**
     * @returns {object}
     * @public
     */
    colorMatrixFilter ()
    {
        const obj = {};

        const matrix = [];
        for (let i = 0; i < 20; i++) {
            matrix[matrix.length] = this.byteStream.getFloat32();
        }

        obj._$ns   = ["flash", "filters"];
        obj._$name = "ColorMatrixFilter";
        obj.params = [null, matrix];

        return obj;
    }

    /**
     * @returns {array}
     * @public
     */
    colorTransform ()
    {
        this.byteStream.byteAlign();

        const colorTransform = [1,1,1,1,0,0,0,0];

        const first6bits    = this.byteStream.getUIBits(6);
        const HasAddTerms   = first6bits >> 5;
        const HasMultiTerms = first6bits >> 4 & 1;
        const nbits         = first6bits & 0x0f;

        if (HasMultiTerms) {
            colorTransform[0] = this.byteStream.getSIBits(nbits) / 256;
            colorTransform[1] = this.byteStream.getSIBits(nbits) / 256;
            colorTransform[2] = this.byteStream.getSIBits(nbits) / 256;
            colorTransform[3] = this.byteStream.getSIBits(nbits) / 256;
        }

        if (HasAddTerms) {
            colorTransform[4] = this.byteStream.getSIBits(nbits);
            colorTransform[5] = this.byteStream.getSIBits(nbits);
            colorTransform[6] = this.byteStream.getSIBits(nbits);
            colorTransform[7] = this.byteStream.getSIBits(nbits);
        }

        return colorTransform;
    }

    /**
     * @param   {number} tag_type
     * @returns void
     * @public
     */
    parseSoundStreamHead (tag_type)
    {
        const obj = {};

        obj.tagType = tag_type;

        this.byteStream.getUIBits(4); // Reserved

        // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
        obj.PlaybackSoundRate = this.byteStream.getUIBits(2);

        // 0 = 8-bit, 1 = 16-bit
        obj.PlaybackSoundSize = this.byteStream.getUIBits(1);

        // 0 = Mono, 1 = Stereo
        obj.PlaybackSoundType = this.byteStream.getUIBits(1);

        // 0 = Uncompressed(native-endian)
        // 1 = ADPCM
        // 2 = MP3
        // 3 = Uncompressed(little-endian)
        // 4 = Nellymoser 16 kHz
        // 5 = Nellymoser 8 kHz
        // 6 = Nellymoser
        // 11 = Speex
        obj.StreamSoundCompression = this.byteStream.getUIBits(4);

        // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
        obj.StreamSoundRate = this.byteStream.getUIBits(2);

        // 0 = 8-bit, 1 = 16-bit
        obj.StreamSoundSize = this.byteStream.getUIBits(1);

        // 0 = Mono, 1 = Stereo
        obj.StreamSoundType = this.byteStream.getUIBits(1);

        obj.StreamSoundSampleCount = this.byteStream.getUI16();

        if (obj.StreamSoundCompression === 2) {
            obj.LatencySeek = this.byteStream.getSIBits(2);
        }
    }

    /**
     * @param  {number} length
     * @return void
     * @public
     */
    parseDefineSound (length)
    {

        const startOffset = this.byteStream.byte_offset;

        const SoundId = this.byteStream.getUI16();
        this.byteStream.getUIBits(4); // SoundFormat
        this.byteStream.getUIBits(2); // SoundRate
        this.byteStream.getUIBit();   // SoundSize
        this.byteStream.getUIBit();   // SoundType
        this.byteStream.getUI32();    // SoundSampleCount

        const dataLength = length - (this.byteStream.byte_offset - startOffset);

        // create object
        const sound = {
            "_$characterId": SoundId,
            "_$data": null,
            "_$buffer": null
        };

        sound._$length = this.byteStream.byte_offset + dataLength;
        sound._$offset = this.byteStream.byte_offset;
        this.byteStream.byte_offset = startOffset + length;

        // let mimeType = "";
        // switch (obj.SoundFormat) {
        //
        //     case 0: // Uncompressed native-endian
        //     case 3: // Uncompressed little-endian
        //         mimeType = "wave";
        //         break;
        //
        //     case 1: // ADPCM ? 32KADPCM
        //         mimeType = "wave";
        //         break;
        //
        //     case 2: // MP3
        //         mimeType = "mpeg";
        //         break;
        //
        //     case 4: // Nellymoser 16
        //     case 5: // Nellymoser 8
        //     case 6: //
        //         mimeType = "nellymoser";
        //         break;
        //
        //     case 11: // Speex
        //         mimeType = "speex";
        //         break;
        //
        //     case 15:
        //         mimeType = "x-aiff";
        //         break;
        //
        // }

        this.setCharacter(SoundId, sound);
    }

    /**
     * @param  {number} tag_type
     * @return {object}
     * @public
     */
    parseStartSound (tag_type)
    {
        const obj = {};

        obj.SoundId = this.byteStream.getUI16();

        if (tag_type === 89) {
            obj.SoundClassName = this.byteStream.getDataUntil();
        }

        obj.SoundInfo = this.parseSoundInfo();

        return obj;
    }

    /**
     * @return void
     * @public
     */
    parseDefineButtonSound ()
    {

        const buttonId = this.byteStream.getUI16();
        const button   = this.getCharacter(buttonId);

        for (let i = 0; i < 4; i++) {

            const soundId = this.byteStream.getUI16();
            if (soundId) {

                const soundInfo = this.parseSoundInfo();
                switch (i) {

                    case 0:
                        button.ButtonStateUpSoundInfo      = soundInfo;
                        button.ButtonStateUpSoundId        = soundId;
                        break;

                    case 1:
                        button.ButtonStateOverSoundInfo    = soundInfo;
                        button.ButtonStateOverSoundId      = soundId;
                        break;

                    case 2:
                        button.ButtonStateDownSoundInfo    = soundInfo;
                        button.ButtonStateDownSoundId      = soundId;
                        break;

                    case 3:
                        button.ButtonStateHitTestSoundInfo = soundInfo;
                        button.ButtonStateHitTestSoundId   = soundId;
                        break;

                }
            }
        }

        this.setCharacter(buttonId, button);
    }

    /**
     * @return {object}
     * @public
     */
    parseSoundInfo ()
    {

        this.byteStream.getUIBits(2); // Reserved

        const obj = {};
        obj.SyncStop       = this.byteStream.getUIBit();
        obj.SyncNoMultiple = this.byteStream.getUIBit();
        obj.HasEnvelope    = this.byteStream.getUIBit();
        obj.HasLoops       = this.byteStream.getUIBit();
        obj.HasOutPoint    = this.byteStream.getUIBit();
        obj.HasInPoint     = this.byteStream.getUIBit();

        if (obj.HasInPoint) {
            obj.InPoint = this.byteStream.getUI32();
        }

        if (obj.HasOutPoint) {
            obj.OutPoint = this.byteStream.getUI32();
        }

        if (obj.HasLoops) {
            obj.LoopCount = this.byteStream.getUI16();
        }

        if (obj.HasEnvelope) {

            const point = this.byteStream.getUI8();

            const EnvelopeRecords = [];
            for (let i = 0; i < point; ++i) {
                EnvelopeRecords[i] = {
                    "Pos44":      this.byteStream.getUI32(),
                    "LeftLevel":  this.byteStream.getUI16(),
                    "RightLevel": this.byteStream.getUI16()
                };
            }

            obj.EnvPoints       = point;
            obj.EnvelopeRecords = EnvelopeRecords;
        }

        return obj;
    }

    /**
     * @returns void
     * @public
     */
    parseDefineFontAlignZones ()
    {
        const FontId = this.byteStream.getUI16();

        const font = this.getFont(FontId) || {};

        font._$CSMTableHint = this.byteStream.getUIBits(2);

        this.byteStream.getUIBits(6); // Reserved

        const NumGlyphs = font._$numGlyphs | 0;
        const ZoneTable = [];

        for (let i = 0; i < NumGlyphs; ++i) {

            const NumZoneData = this.byteStream.getUI8(); // always 2.

            const ZoneData = [];
            for (let idx = 0; idx < NumZoneData; ++idx) {
                ZoneData.push(this.byteStream.getFloat16()); // AlignmentCoordinate
                ZoneData.push(this.byteStream.getFloat16()); // Range
            }

            this.byteStream.getUIBits(6); // // Reserved

            // not use
            this.byteStream.getUIBits(1); // ZoneMaskY
            this.byteStream.getUIBits(1); // ZoneMaskX

            ZoneTable[i] = ZoneData;

        }

        this.byteStream.byteAlign();

        font._$zoneTable = ZoneTable;

        this.setFont(FontId, font);
    }

    /**
     * @param {number} tag_type
     * @public
     */
    parseCSMTextSettings (tag_type)
    {
        const id = this.byteStream.getUI16();

        const obj = {};

        obj.tagType      = tag_type;
        obj.UseFlashType = this.byteStream.getUIBits(2);
        obj.GridFit      = this.byteStream.getUIBits(3);

        this.byteStream.getUIBits(3); // Reserved

        obj.Thickness = this.byteStream.getUI32();
        obj.Sharpness = this.byteStream.getUI32();

        this.byteStream.getUI8(); // Reserved

        this.setTextSetting(id, obj);
    }

    /**
     * TODO
     * @param {number} tag_type
     * @param {number} length
     * @public
     */
    parseSoundStreamBlock (tag_type, length)
    {
        const obj = {};

        obj.tagType    = tag_type;
        obj.compressed = this.byteStream.getData(length);
    }

    /**
     * @returns void
     * @public
     */
    parseDefineScalingGrid ()
    {
        const id   = this.byteStream.getUI16();
        const rect = this.rect();
        this.setGrid(id, rect);
    }

    /**
     * @param   {array} characters
     * @param   {array} [buffers=undefined]
     * @returns void
     * @public
     */
    postCharacter (characters, buffers)
    {
        globalThis.postMessage({
            "infoKey": "_$characters",
            "characters": characters
        }, buffers);

        characters.length = 0;

        if (buffers) {
            buffers.length = 0;
        }
    }

}

// set
Util.$swfParser = new SwfParser();

/**
 * @see Util.$parserWorker
 */
this.addEventListener("message", function (event)
{
    const swfParser = Util.$swfParser;

    // setup
    swfParser.version = event.data.version;

    // init data
    swfParser.byteStream.setData(event.data.buffer);
    swfParser.byteStream.byte_offset = event.data.offset;

    // execute parse
    const parent = Util.$createMovieClip();

    swfParser.parseTags(event.data.buffer.length, parent);
    swfParser.postData(parent);

    // reset
    swfParser.clear();
});
