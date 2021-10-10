#/bin/bash

output=$(expect -c "set timeout 20
spawn telnet $1 9993
expect \"model:\"
send \"clips get\n\"
send \"transport info\n\"
expect \"dynamic\"
send \"\x1D\"
expect \"telnet>\"
send \"close\n\"
expect \"closed\"")

lines=$(echo "$output" |grep .mov |cut -d' ' -f4)
clip_id=$(echo "$output"|grep 'clip id'|cut -d' ' -f3)
current_time=$(echo "$output" |grep 'display timecode:' |cut -d' ' -f3|cut -d';' -f1)
total_time=$(echo "$lines" | sed -n "${clip_id}p" |cut -d';' -f1)

c_h=$(echo "$current_time" |cut -d":" -f1)
c_m=$(echo "$current_time" |cut -d":" -f2)
c_s=$(echo "$current_time" |cut -d":" -f3)

t_h=$(echo "$total_time" |cut -d":" -f1)
t_m=$(echo "$total_time" |cut -d":" -f2)
t_s=$(echo "$total_time" |cut -d":" -f3)

css=$(echo "($c_h*3600)+($c_m*60)+$c_s" | bc)
tss=$(echo "($t_h*3600)+($t_m*60)+$t_s"| bc)
dss=$(echo "$tss-$css"| bc)

convertsecs() {
 h=$(bc <<< "${1}/3600")
 m=$(bc <<< "(${1}%3600)/60")
 s=$(bc <<< "${1}%60")
 printf "%02d:%02d:%02d\n" $h $m $s
}

echo $(convertsecs $dss)
