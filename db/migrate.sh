for i in {5..0}
do
	level="N$i"
	echo $level
	curl "localhost:3020/migrate/$level"
done

for y in {17..19}
do
	for m in $(seq -f "%02g" 1 12)
	do
		for l in "E" "F" "J"
		do
			level="${l}${y}${m}"
			echo $level
			curl "localhost:3020/migrate/$level"
		done
	done
done
