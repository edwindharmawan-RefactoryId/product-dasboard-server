const { Items, Transactions } = require('../models')
const { Op } = require("sequelize");

async function createItem (req, res) {
  const { name, stock, sold, itemType } = req.body

  const errors = []
	try {
    if (!name) {
      errors.push('Product name is required.')
    }
    if (!itemType) {
      errors.push('Product type is required.')
    }
    if (!stock) {
      errors.push('Product stock required and must be at least 1.')
    }

    if (errors.length) {
      return res.status(400).json({
        messages: errors
      })
    }

		const item = await Items.create({
      name,
      sold: sold || 0,
      stock,
      itemType,
		})

    await Transactions.create({
      ItemId: item.id,
      transactionDate: item.createdAt,
      quantity: stock,
      updatedStock: stock,
    })

		return res.status(201).json({
			data: {
        message: 'Success create product.',
        item
			}
		})

	} catch (error) {
    console.log(error);
		return res.status(500).json({
			messages: ['Internal server error', error]
		})
	}
}

async function itemList (req, res) {
  const { limit, offset, search, startDate, endDate } = req.query
  try {
    let items
    if (startDate && endDate) {
      items = await Items.findAll({
        limit: +limit || 5,
        offset: +offset || 0,
        order: [
          ['updatedAt', 'DESC']
        ],
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } }
          ],
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          }
        },
        include: [
          { model: Transactions, as: 'Transactions' }
        ]
      })
    } else {
      items = await Items.findAll({
        limit: +limit || 5,
        offset: +offset || 0,
        order: [
          ['updatedAt', 'DESC']
        ],
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } }
          ]
        },
        include: [
          { model: Transactions, as: 'Transactions' }
        ]
      })
    }

    return res.status(200).json({
      data: {
        message: 'Success get products',
        limit: +limit || 5,
        offset: +offset || 0,
        items,
      },
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messages: ['Internal server error']
    })
  }
}

async function updateItem (req, res) {
  const { id } = req.params
  const { name, stock, sold, itemType } = req.body

  const errors = []
	try {
    const item = await Items.findByPk(id)

    if (!item) {
      return res.status(404).json({
        message: ['Product not found.']
      })
    }

    if (!name) {
      errors.push('Product name is required.')
    }
    if (!itemType) {
      errors.push('Product type is required.')
    }
    if (!stock) {
      errors.push('Product stock required and must be at least 1.')
    }
    if (isNaN(sold)) {
      errors.push('Product sold required, do not empty or field 0')
    }

    if (item.name == name && item.stock == stock && item.sold == +sold && item.itemType ===  itemType) {
      errors.push('There is no changes, please input correctly.')
    }

    if (errors.length) {
      return res.status(400).json({
        messages: errors
      })
    }

    await Items.update({
      name,
      sold: sold || 0,
      stock,
      itemType,
		}, { where: { id } })

    await Transactions.create({
      ItemId: id,
      transactionDate: new Date(),
      quantity: item.stock - stock,
      updatedStock: stock,
    })

    return res.status(200).json({
      data: {
        message: 'Success edit product.',
        item: {
          name, stock, sold, itemType
        }
      }
    })
    
  } catch (error) {
    console.log(error);
		return res.status(500).json({
			messages: ['Internal server error', error]
		})
  }
}

async function deleteItem (req, res) {
  const { id } = req.params
  try {
    const item = await Items.findByPk(id)

    if (!item) {
      return res.status(404).json({
        message: ['Product not found.']
      })
    }
    await Items.destroy({
      where: { id }
    })

    return res.status(200).json({
      data: {
        message:'Success delete product.',
      }
    })

  } catch (error) {
    console.log(error);
		return res.status(500).json({
			messages: ['Internal server error', error]
		})
  }
}

module.exports = { itemList, createItem, updateItem, deleteItem }