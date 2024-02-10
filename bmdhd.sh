#/bin/bash

output=$(expect -c "set timeout 10
spawn telnet $1 9993
expect \"model:\"
send \"clips get\n\"
send \"transport info\n\"
expect \"dynamic\"
send \"\x1D\"
expect \"telnet>\"
send \"close\n\"
expect \"closed\"")

# Clips lenghts
clips_length=$(echo "$output" |grep .mov |cut -d' ' -f4)
# If there is no clip, no connection, or no .mov files on the device
clips_counter=$(echo "${#clips_lenght[@]}"|tr -cd 0-9)
if [ "${clips_counter}" -lt 1 ]; then
	printf '%s\n' "No connection, or missing videos" >&2
else 
	# Start time of clips
	start_times=$(echo "$output" |grep .mov |cut -d' ' -f3)
	# Clip id, only numbers:tr -cd 0-9
	clip_id=$(echo "$output"|grep 'clip id'|cut -d' ' -f3|tr -cd 0-9)
	# The clip current time
	current_time=$(echo "$output" |grep 'display timecode:' |cut -d' ' -f3|cut -d';' -f1)
	# The clip lenght
	total_time=$(echo "$clips_length" | sed -n "${clip_id}p")
	start_time=$(echo "$start_times" | sed -n "${clip_id}p")

	# The remaining time = start_time + total_time - current_time
	s_h=$(echo "$start_time" |cut -d":" -f1)
	s_m=$(echo "$start_time" |cut -d":" -f2)
	s_s=$(echo "$start_time" |cut -d":" -f3)

	c_h=$(echo "$current_time" |cut -d":" -f1)
	c_m=$(echo "$current_time" |cut -d":" -f2)
	c_s=$(echo "$current_time" |cut -d":" -f3)

	t_h=$(echo "$total_time" |cut -d":" -f1)
	t_m=$(echo "$total_time" |cut -d":" -f2)
	t_s=$(echo "$total_time" |cut -d":" -f3)

	sss=$(echo "($s_h*3600)+($s_m*60)+$s_s" | bc)
	css=$(echo "($c_h*3600)+($c_m*60)+$c_s" | bc)
	tss=$(echo "($t_h*3600)+($t_m*60)+$t_s"| bc)

	dss=$(echo "$sss+$tss-$css"| bc)

	# Checks the negative time because it contains a rounding error (not frame accurate)
	if [ "${dss}" -lt 0 ]; then
 		dss="0"
	fi

	echo $(convertsecs $dss)
fi

# The time format
convertsecs() {

	h=$(echo "${1}/3600"| bc)
	m=$(echo "(${1}%3600)/60"| bc)
 	s=$(echo "${1}%60"| bc)
	printf "%02d:%02d:%02d\n" $h $m $s
}
