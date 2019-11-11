NAME= N-puzzle

SRCDIR = src

SRCS = $(shell find $(SRCDIR) -name '*.ts')

.PHONY: all clean fclean re

all: $(NAME)

$(NAME): $(SRCS)
	@yarn
	@yarn build
	@yarn global add nexe
	@nexe dist/index.js

clean:
	@rm -rf node_modules dist

fclean: clean
	@rm -f $(NAME)

re: fclean all

