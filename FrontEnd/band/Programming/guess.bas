loadbmp "curtain", "curtain.bmp"
loadbmp "d1", "daniel.bmp"
loadbmp "d2", "paul.bmp"
loadbmp "d3", "daxton.bmp"
loadbmp "bazlogo", "baz.bmp"

button #main.button1, "Curtain 1", [action1], UL, 20, 380, 200, 50
button #main.replace1, "Close Curtain", [close1], UL, 20, 330, 200, 40
button #main.button2, "Curtain 2", [action2], UL, 320, 380, 200, 50
button #main.replace2, "Close Curtain", [close2], UL, 320, 330, 200, 40
button #main.button3, "Curtain 3", [action3], UL, 620, 380, 200, 50
button #main.replace3, "Close Curtain", [close3], UL, 620, 330, 200, 40
button #main.close, "Quit", [done], UL, 200, 450, 200, 80
button #main.shuffle, "Play Again", [shuffle], UL, 430, 450, 200, 80

graphicbox #main.draw1, 20, 178, 200, 150
graphicbox #main.draw2, 320, 178, 200, 150
graphicbox #main.draw3, 620, 178, 200, 150
graphicbox #main.draw4, 150, 20, 548, 134

nomainwin


WindowWidth = 880
WindowHeight = 610


open "Guess" for graphics as #main




[start]
print #main, "down ; fill darkblue"
print #main, "trapclose [quit]"
print #main.draw1, "drawbmp curtain"
print #main.draw2, "drawbmp curtain"
print #main.draw3, "drawbmp curtain"
print #main.draw4, "drawbmp bazlogo"



x =(int(rnd(1)*3)+1)
y =(int(rnd(1)*3)+1)
z =(int(rnd(1)*3)+1)

if x = y then
goto [start]
end if

if x = z then
goto [start]
end if

if y = x then
goto [start]
end if

if y = z then
goto [start]
end if

if z = x then
goto [start]
end if

if z = y then
goto [start]
end if


notice "Find the lead singer of Bazeika, the hot new boy band."

wait

[action1]


if x = 1 then
    print #main.draw1, "drawbmp d1"
end if
if x = 2 then
    print #main.draw1, "drawbmp d2"
notice "YOU WIN! HEHEHEHEHe Paul is going the Philippines."

end if

if x = 3 then
    print #main.draw1, "drawbmp d3"
end if

wait



[action2]




if y = 1 then
    print #main.draw2, "drawbmp d1"
end if
if y = 2 then
    print #main.draw2, "drawbmp d2"
notice "YOU WIN! Ryan and Jaron are here."

end if
if y = 3 then
    print #main.draw2, "drawbmp d3"
end if





wait

[action3]


if z = 1 then
    print #main.draw3, "drawbmp d1"
end if
if z = 2 then
    print #main.draw3, "drawbmp d2"
notice "YOU WIN! HEHEHEHEHEHEHE."

end if
if z = 3 then
    print #main.draw3, "drawbmp d3"
end if





wait


[close1]

print #main.draw1, "drawbmp curtain"
wait


[close2]

print #main.draw2, "drawbmp curtain"
wait



[close3]

print #main.draw3, "drawbmp curtain"
wait



[shuffle]

gosub [start]





[done]

close #main
end





[quit]

close #main
end


